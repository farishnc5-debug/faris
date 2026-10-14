import { BaseElmTransport, ObdError } from "./transport";

export class SerialObdTransport extends BaseElmTransport {
  readonly kind = "serial" as const;
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter<string> | null = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private readLoopAbort = false;

  get label(): string {
    return "USB OBD2 adapter";
  }

  async connect(): Promise<void> {
    if (!navigator.serial) {
      throw new ObdError("Web Serial is not available in this browser.");
    }

    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 38400 });

    const textDecoderStream = new TextDecoderStream();
    this.port.readable
      ?.pipeTo(textDecoderStream.writable as unknown as WritableStream<Uint8Array>)
      .catch(() => {
        // Stream closed on disconnect; nothing to do.
      });
    this.reader = textDecoderStream.readable.getReader();

    const textEncoderStream = new TextEncoderStream();
    (textEncoderStream.readable as unknown as ReadableStream<Uint8Array>)
      .pipeTo(this.port.writable!)
      .catch(() => {});
    this.writer = textEncoderStream.writable.getWriter();

    this.readLoopAbort = false;
    this.pumpReads();
    this.setConnected(true);
  }

  private async pumpReads() {
    while (!this.readLoopAbort && this.reader) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) this.onData(value);
      } catch {
        break;
      }
    }
    this.setConnected(false);
  }

  async disconnect(): Promise<void> {
    this.readLoopAbort = true;
    try {
      await this.reader?.cancel();
    } catch {
      /* ignore */
    }
    try {
      await this.writer?.close();
    } catch {
      /* ignore */
    }
    try {
      await this.port?.close();
    } catch {
      /* ignore */
    }
    this.setConnected(false);
  }

  protected async writeRaw(data: string): Promise<void> {
    if (!this.writer) throw new ObdError("Not connected");
    await this.writer.write(data);
  }
}

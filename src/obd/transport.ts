// Transport abstraction over an ELM327 OBD2 adapter.
// A transport just needs to send a raw AT/OBD command string and resolve
// with the raw text response (prompt character and echoes stripped).

export interface ObdTransport {
  readonly kind: "bluetooth" | "serial";
  readonly label: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendCommand(command: string, timeoutMs?: number): Promise<string>;
  isConnected(): boolean;
}

export class ObdError extends Error {}
export class ObdTimeoutError extends ObdError {}
export class ObdNotSupportedError extends ObdError {}

// ELM327 replies end with a '>' prompt. Responses are terminated by CR.
const PROMPT = ">";

function cleanResponse(raw: string): string {
  return raw
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l !== PROMPT)
    .join("\n")
    .trim();
}

/** Shared line-buffering + command/response pump used by both transports. */
export abstract class BaseElmTransport implements ObdTransport {
  abstract readonly kind: "bluetooth" | "serial";
  abstract readonly label: string;

  private buffer = "";
  private pending: { resolve: (v: string) => void; reject: (e: Error) => void } | null = null;
  private connected = false;

  isConnected(): boolean {
    return this.connected;
  }

  protected setConnected(v: boolean) {
    this.connected = v;
  }

  protected abstract writeRaw(data: string): Promise<void>;

  protected onData(chunk: string) {
    this.buffer += chunk;
    if (this.buffer.includes(PROMPT)) {
      const response = this.buffer.slice(0, this.buffer.indexOf(PROMPT));
      this.buffer = this.buffer.slice(this.buffer.indexOf(PROMPT) + 1);
      if (this.pending) {
        const { resolve } = this.pending;
        this.pending = null;
        resolve(cleanResponse(response));
      }
    }
  }

  async sendCommand(command: string, timeoutMs = 4000): Promise<string> {
    if (!this.connected) throw new ObdError("Not connected");
    if (this.pending) throw new ObdError("Command already in flight");

    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending = null;
        reject(new ObdTimeoutError(`Timed out waiting for response to "${command}"`));
      }, timeoutMs);

      this.pending = {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      };

      this.writeRaw(command + "\r").catch((e) => {
        clearTimeout(timer);
        this.pending = null;
        reject(e instanceof Error ? e : new ObdError(String(e)));
      });
    });
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
}

// A curated set of the most commonly encountered generic (SAE-defined)
// DTCs, with English and Arabic descriptions. Manufacturer-specific codes
// (which vary by make) are not covered here; unknown codes fall back to a
// generic "see manufacturer documentation" message.

export interface DtcDescription {
  en: string;
  ar: string;
}

export const DTC_DESCRIPTIONS: Record<string, DtcDescription> = {
  P0100: { en: "Mass or Volume Air Flow Circuit Malfunction", ar: "عطل في دائرة حساس تدفق الهواء (MAF)" },
  P0101: { en: "Mass or Volume Air Flow Circuit Range/Performance Problem", ar: "مشكلة في أداء حساس تدفق الهواء (MAF)" },
  P0110: { en: "Intake Air Temperature Circuit Malfunction", ar: "عطل في دائرة حساس حرارة هواء السحب" },
  P0115: { en: "Engine Coolant Temperature Circuit Malfunction", ar: "عطل في دائرة حساس حرارة سائل التبريد" },
  P0120: { en: "Throttle Position Sensor/Switch A Circuit Malfunction", ar: "عطل في دائرة حساس موضع دواسة البنزين" },
  P0128: { en: "Coolant Thermostat (below thermostat regulating temperature)", ar: "ثرموستات التبريد لا يصل لحرارة التشغيل" },
  P0130: { en: "O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)", ar: "عطل في دائرة حساس الأكسجين (البنك 1 الحساس 1)" },
  P0171: { en: "System Too Lean (Bank 1)", ar: "خليط الوقود فقير جداً (البنك 1)" },
  P0172: { en: "System Too Rich (Bank 1)", ar: "خليط الوقود غني جداً (البنك 1)" },
  P0174: { en: "System Too Lean (Bank 2)", ar: "خليط الوقود فقير جداً (البنك 2)" },
  P0175: { en: "System Too Rich (Bank 2)", ar: "خليط الوقود غني جداً (البنك 2)" },
  P0201: { en: "Injector Circuit Malfunction - Cylinder 1", ar: "عطل في دائرة حاقن الوقود - السلندر 1" },
  P0217: { en: "Engine Overtemperature Condition", ar: "ارتفاع حرارة المحرك عن الحد المسموح" },
  P0230: { en: "Fuel Pump Primary Circuit Malfunction", ar: "عطل في الدائرة الأساسية لطرمبة البنزين" },
  P0300: { en: "Random/Multiple Cylinder Misfire Detected", ar: "اكتشاف تعثر إشعال عشوائي/متعدد السلندرات" },
  P0301: { en: "Cylinder 1 Misfire Detected", ar: "تعثر إشعال في السلندر 1" },
  P0302: { en: "Cylinder 2 Misfire Detected", ar: "تعثر إشعال في السلندر 2" },
  P0303: { en: "Cylinder 3 Misfire Detected", ar: "تعثر إشعال في السلندر 3" },
  P0304: { en: "Cylinder 4 Misfire Detected", ar: "تعثر إشعال في السلندر 4" },
  P0305: { en: "Cylinder 5 Misfire Detected", ar: "تعثر إشعال في السلندر 5" },
  P0306: { en: "Cylinder 6 Misfire Detected", ar: "تعثر إشعال في السلندر 6" },
  P0325: { en: "Knock Sensor 1 Circuit Malfunction", ar: "عطل في دائرة حساس الطقطقة 1" },
  P0335: { en: "Crankshaft Position Sensor A Circuit Malfunction", ar: "عطل في دائرة حساس موضع عمود المرفق" },
  P0340: { en: "Camshaft Position Sensor Circuit Malfunction", ar: "عطل في دائرة حساس موضع عمود الكامات" },
  P0401: { en: "Exhaust Gas Recirculation Flow Insufficient", ar: "تدفق غير كافٍ في نظام إعادة تدوير غازات العادم (EGR)" },
  P0420: { en: "Catalyst System Efficiency Below Threshold (Bank 1)", ar: "كفاءة المحول الحفاز أقل من الحد المطلوب (البنك 1)" },
  P0430: { en: "Catalyst System Efficiency Below Threshold (Bank 2)", ar: "كفاءة المحول الحفاز أقل من الحد المطلوب (البنك 2)" },
  P0440: { en: "Evaporative Emission Control System Malfunction", ar: "عطل في نظام التحكم بانبعاثات تبخر الوقود" },
  P0442: { en: "Evaporative Emission System Leak Detected (small leak)", ar: "تسريب صغير مكتشف في نظام تبخر الوقود" },
  P0455: { en: "Evaporative Emission System Leak Detected (large leak)", ar: "تسريب كبير مكتشف في نظام تبخر الوقود" },
  P0500: { en: "Vehicle Speed Sensor Malfunction", ar: "عطل في حساس سرعة السيارة" },
  P0505: { en: "Idle Control System Malfunction", ar: "عطل في نظام التحكم بحركة المحرك عند الوقوف" },
  P0600: { en: "Serial Communication Link Malfunction", ar: "عطل في رابط الاتصال التسلسلي بين الكمبيوترات" },
  P0601: { en: "Internal Control Module Memory Check Sum Error", ar: "خطأ في فحص ذاكرة وحدة التحكم الداخلية" },
  P0700: { en: "Transmission Control System Malfunction", ar: "عطل في نظام التحكم بناقل الحركة" },
  P0715: { en: "Input/Turbine Speed Sensor Circuit Malfunction", ar: "عطل في دائرة حساس سرعة دخل ناقل الحركة" },
  P0730: { en: "Incorrect Gear Ratio", ar: "نسبة تروس غير صحيحة" },
  P0740: { en: "Torque Converter Clutch Circuit Malfunction", ar: "عطل في دائرة قابض محول العزم" },
  C0035: { en: "Left Front Wheel Speed Sensor Circuit", ar: "عطل في دائرة حساس سرعة العجلة الأمامية اليسرى" },
  C0040: { en: "Right Front Wheel Speed Sensor Circuit", ar: "عطل في دائرة حساس سرعة العجلة الأمامية اليمنى" },
  B0001: { en: "Driver Frontal Stage 1 Deployment Control", ar: "تحكم انتشار كمام الهواء الأمامي للسائق - المرحلة 1" },
  U0100: { en: "Lost Communication With ECM/PCM", ar: "فقدان الاتصال مع وحدة التحكم بالمحرك" },
  U0101: { en: "Lost Communication With TCM", ar: "فقدان الاتصال مع وحدة التحكم بناقل الحركة" },
};

export function describeDtc(code: string, locale: "en" | "ar"): string {
  const entry = DTC_DESCRIPTIONS[code];
  if (entry) return entry[locale];
  return locale === "ar" ? "راجع كتيب الشركة المصنّعة لهذا الرمز" : "See manufacturer documentation for this code";
}

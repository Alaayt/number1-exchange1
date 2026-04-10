// models/ExchangeMethod.js
// Dynamic exchange methods (send/receive) — managed from admin panel
const mongoose = require("mongoose");

const methodItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // unique id e.g. 'vodafone', 'usdt-trc', 'custom-xyz'
    name: { type: String, required: true }, // display name
    symbol: { type: String, required: true }, // currency symbol: EGP, USDT, MGO, etc.
    type: {
      type: String,
      enum: ["egp", "crypto", "moneygo", "wallet", "custom"],
      default: "custom",
    },
    color: { type: String, default: "#3b82f6" },
    img: { type: String, default: null }, // image URL or path
    icon: { type: String, default: null }, // emoji fallback icon
    enabled: { type: Boolean, default: true },
    mode: {
      type: String,
      enum: ["default", "custom"],
      default: "default",
    },
    // for receive methods
    placeholder: { type: String, default: "" },
    // rate mapping keys (how this method maps to rate pairs)
    rateKey: { type: String, default: "" }, // e.g. 'EGP_VODAFONE', 'USDT', 'MGO', 'INTERNAL'
    // payment method mapping
    paymentMethodKey: { type: String, default: "" }, // e.g. 'VODAFONE_CASH', 'USDT_TRC20', 'WALLET'
    // compatible methods (which receive methods can this send method pair with, and vice versa)
    compatibleWith: { type: [String], default: [] }, // array of method IDs
    // per-method limits (0 = use global)
    minAmount: { type: Number, default: 0 },
    maxAmount: { type: Number, default: 0 },
    // sort order
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const exchangeMethodSchema = new mongoose.Schema(
  {
    sendMethods: { type: [methodItemSchema], default: [] },
    receiveMethods: { type: [methodItemSchema], default: [] },
  },
  { timestamps: true }
);

// Default send methods (matching existing currencies.js)
const DEFAULT_SEND = [
  {
    id: "vodafone",
    name: "Vodafone Cash",
    symbol: "EGP",
    type: "egp",
    color: "#e50000",
    img: "/images/vodafone.png",
    enabled: true,
    mode: "default",
    rateKey: "EGP_VODAFONE",
    paymentMethodKey: "VODAFONE_CASH",
    compatibleWith: ["mgo-recv", "usdt-trc", "usdt-bnb"],
    sortOrder: 0,
  },
  {
    id: "instapay",
    name: "InstaPay",
    symbol: "EGP",
    type: "egp",
    color: "#6a0dad",
    img: "/images/instapay.png",
    enabled: true,
    mode: "default",
    rateKey: "EGP_INSTAPAY",
    paymentMethodKey: "INSTAPAY",
    compatibleWith: ["mgo-recv", "usdt-trc", "usdt-bnb"],
    sortOrder: 1,
  },
  {
    id: "usdt-trc",
    name: "USDT TRC20",
    symbol: "USDT",
    type: "crypto",
    color: "#26a17b",
    img: "/images/usdt.png",
    enabled: true,
    mode: "default",
    rateKey: "USDT",
    paymentMethodKey: "USDT_TRC20",
    network: "TRC20",
    compatibleWith: ["mgo-recv", "wallet-recv"],
    sortOrder: 2,
  },
  {
    id: "usdt-bnb",
    name: "USDT BEP20",
    symbol: "USDT",
    type: "crypto",
    color: "#f0b90b",
    img: "/images/bnb.png",
    enabled: true,
    mode: "default",
    rateKey: "USDT",
    paymentMethodKey: "USDT_BEP20",
    network: "BEP20",
    compatibleWith: ["mgo-recv", "wallet-recv"],
    sortOrder: 3,
  },
  {
    id: "mgo-send",
    name: "MoneyGo USD",
    symbol: "MGO",
    type: "moneygo",
    color: "#00c17c",
    img: "/images/moneygo.png",
    enabled: true,
    mode: "default",
    rateKey: "MGO",
    paymentMethodKey: "MONEYGO",
    compatibleWith: ["usdt-trc", "usdt-bnb"],
    sortOrder: 4,
  },
  {
    id: "wallet-usdt",
    name: "\u0645\u062d\u0641\u0638\u0629 \u062f\u0627\u062e\u0644\u064a\u0629",
    symbol: "USDT",
    type: "wallet",
    color: "#378ADD",
    img: null,
    enabled: true,
    mode: "default",
    rateKey: "INTERNAL",
    paymentMethodKey: "WALLET",
    compatibleWith: ["usdt-trc", "usdt-bnb", "mgo-recv"],
    sortOrder: 5,
  },
];

// Default receive methods
const DEFAULT_RECEIVE = [
  {
    id: "mgo-recv",
    name: "MoneyGo USD",
    symbol: "MGO",
    type: "moneygo",
    color: "#00c17c",
    img: "/images/moneygo.png",
    enabled: true,
    mode: "default",
    rateKey: "MGO",
    placeholder: "U-XXXXXXXX",
    compatibleWith: ["vodafone", "instapay", "usdt-trc", "usdt-bnb", "wallet-usdt"],
    sortOrder: 0,
  },
  {
    id: "usdt-trc",
    name: "USDT TRC20",
    symbol: "USDT",
    type: "crypto",
    color: "#26a17b",
    img: "/images/usdt.png",
    enabled: true,
    mode: "default",
    rateKey: "USDT",
    paymentMethodKey: "USDT_TRC20",
    network: "TRC20",
    placeholder: "T...",
    compatibleWith: ["vodafone", "instapay", "mgo-send", "wallet-usdt"],
    sortOrder: 1,
  },
  {
    id: "usdt-bnb",
    name: "USDT BEP20",
    symbol: "USDT",
    type: "crypto",
    color: "#f0b90b",
    img: "/images/bnb.png",
    enabled: true,
    mode: "default",
    rateKey: "USDT",
    paymentMethodKey: "USDT_BEP20",
    network: "BEP20",
    placeholder: "0x...",
    compatibleWith: ["vodafone", "instapay", "mgo-send", "wallet-usdt"],
    sortOrder: 2,
  },
  {
    id: "wallet-recv",
    name: "محفظة داخلية",
    symbol: "USDT",
    type: "wallet",
    color: "#378ADD",
    img: null,
    enabled: true,
    mode: "default",
    rateKey: "INTERNAL",
    placeholder: "",
    compatibleWith: ["usdt-trc", "usdt-bnb"],
    sortOrder: 3,
  },
];

// Patch a method array: fill empty name/symbol/type from the defaults map
function patchMethods(methods, defaults) {
  const defMap = {};
  defaults.forEach(d => { defMap[d.id] = d; });
  return methods.map(m => {
    const def = defMap[m.id] || {};
    const patched = { ...m };
    if (!patched.name   || !patched.name.trim())   patched.name   = def.name   || m.id;
    if (!patched.symbol || !patched.symbol.trim())  patched.symbol = def.symbol || 'USDT';
    if (!patched.type   || !patched.type.trim())    patched.type   = def.type   || 'custom';
    if (!patched.rateKey           && def.rateKey)           patched.rateKey           = def.rateKey;
    if (!patched.paymentMethodKey  && def.paymentMethodKey)  patched.paymentMethodKey  = def.paymentMethodKey;
    if (!patched.color             && def.color)             patched.color             = def.color;
    if (!patched.img  && def.img)  patched.img  = def.img;
    return patched;
  });
}

exchangeMethodSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sendMethods: DEFAULT_SEND,
      receiveMethods: DEFAULT_RECEIVE,
    });
    return doc;
  }

  // ── Migration: patch any methods with empty name/symbol from defaults ──
  const needsPatch =
    doc.sendMethods.some(m => !m.name || !m.symbol) ||
    doc.receiveMethods.some(m => !m.name || !m.symbol);

  if (needsPatch) {
    const patchedSend = patchMethods(doc.sendMethods, DEFAULT_SEND);
    const patchedRecv = patchMethods(doc.receiveMethods, DEFAULT_RECEIVE);
    doc = await this.findOneAndUpdate(
      { _id: doc._id },
      { $set: { sendMethods: patchedSend, receiveMethods: patchedRecv } },
      { new: true }
    );
    console.log('[ExchangeMethod] Auto-patched methods with missing name/symbol.');
  }

  return doc;
};

module.exports = mongoose.model("ExchangeMethod", exchangeMethodSchema);

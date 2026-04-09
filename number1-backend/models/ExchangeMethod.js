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
    compatibleWith: ["mgo-recv", "usdt-recv"],
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
    compatibleWith: ["mgo-recv", "usdt-recv"],
    sortOrder: 1,
  },
  {
    id: "fawry",
    name: "Fawry",
    symbol: "EGP",
    type: "egp",
    color: "#f97316",
    img: "/images/fawry.png",
    enabled: true,
    mode: "default",
    rateKey: "EGP_FAWRY",
    paymentMethodKey: "FAWRY",
    compatibleWith: ["mgo-recv", "usdt-recv"],
    sortOrder: 2,
  },
  {
    id: "orange",
    name: "Orange Cash",
    symbol: "EGP",
    type: "egp",
    color: "#ff7700",
    img: "/images/orange.png",
    enabled: true,
    mode: "default",
    rateKey: "EGP_ORANGE",
    paymentMethodKey: "ORANGE_CASH",
    compatibleWith: ["mgo-recv", "usdt-recv"],
    sortOrder: 3,
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
    compatibleWith: ["mgo-recv", "wallet-recv"],
    sortOrder: 4,
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
    compatibleWith: ["usdt-recv"],
    sortOrder: 5,
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
    compatibleWith: ["usdt-recv", "mgo-recv"],
    sortOrder: 6,
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
    compatibleWith: [
      "vodafone",
      "instapay",
      "fawry",
      "orange",
      "usdt-trc",
      "wallet-usdt",
    ],
    sortOrder: 0,
  },
  {
    id: "usdt-recv",
    name: "USDT TRC20",
    symbol: "USDT",
    type: "crypto",
    color: "#26a17b",
    img: "/images/usdt.png",
    enabled: true,
    mode: "default",
    rateKey: "USDT",
    placeholder: "T...",
    compatibleWith: [
      "vodafone",
      "instapay",
      "fawry",
      "orange",
      "mgo-send",
      "wallet-usdt",
    ],
    sortOrder: 1,
  },
  {
    id: "wallet-recv",
    name: "\u0645\u062d\u0641\u0638\u0629 \u062f\u0627\u062e\u0644\u064a\u0629",
    symbol: "USDT",
    type: "wallet",
    color: "#378ADD",
    img: null,
    enabled: true,
    mode: "default",
    rateKey: "INTERNAL",
    placeholder: "",
    compatibleWith: ["usdt-trc"],
    sortOrder: 2,
  },
];

exchangeMethodSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sendMethods: DEFAULT_SEND,
      receiveMethods: DEFAULT_RECEIVE,
    });
  }
  return doc;
};

module.exports = mongoose.model("ExchangeMethod", exchangeMethodSchema);

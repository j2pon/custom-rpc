require("dotenv").config();
const RPC = require("discord-rpc");

const clientId = process.env.CLIENT_ID;
const startTimestamp = new Date();
let hasLoggedActive = false;

if (!clientId) {
  console.error("CLIENT_ID eksik. .env dosyasina Discord Application ID ekleyin.");
  process.exit(1);
}

const rpc = new RPC.Client({ transport: "ipc" });

const parseUnixTimestamp = (value) => {
  if (!value) return undefined;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return undefined;
  return new Date(numeric * 1000);
};

const sanitizeText = (value, minLen = 2) => {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  if (cleaned.length < minLen) return undefined;
  return cleaned;
};

const isValidButtonUrl = (value) => {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getButtons = () => {
  const buttons = [];
  const b1Label = sanitizeText(process.env.BUTTON1_LABEL, 2);
  const b2Label = sanitizeText(process.env.BUTTON2_LABEL, 2);
  const b1Url = process.env.BUTTON1_URL?.trim();
  const b2Url = process.env.BUTTON2_URL?.trim();

  if (b1Label && b1Url && isValidButtonUrl(b1Url)) {
    buttons.push({
      label: b1Label,
      url: b1Url,
    });
  }

  if (b2Label && b2Url && isValidButtonUrl(b2Url)) {
    buttons.push({
      label: b2Label,
      url: b2Url,
    });
  }

  return buttons.slice(0, 2);
};

const buildActivity = () => {
  const buttons = getButtons();
  const parsedStart = parseUnixTimestamp(process.env.START_TIMESTAMP);
  const parsedEnd = parseUnixTimestamp(process.env.END_TIMESTAMP);
  const durationHours = Number(process.env.DURATION_HOURS || "120");
  const hasValidDuration = Number.isFinite(durationHours) && durationHours > 0;
  const effectiveStart = parsedStart || startTimestamp;
  const effectiveEnd =
    parsedEnd ||
    (hasValidDuration
      ? new Date(effectiveStart.getTime() + durationHours * 60 * 60 * 1000)
      : undefined);
  const details = sanitizeText(process.env.DETAILS, 2) || "J2pon Rich Presence";
  const state = sanitizeText(process.env.STATE, 2) || "Bir seyler yapiyor...";
  const activity = {
    details,
    state,
    startTimestamp: effectiveStart,
    endTimestamp: effectiveEnd,
    largeImageKey: process.env.LARGE_IMAGE_KEY || undefined,
    largeImageText: sanitizeText(process.env.LARGE_IMAGE_TEXT, 2),
    smallImageKey: process.env.SMALL_IMAGE_KEY || undefined,
    smallImageText: sanitizeText(process.env.SMALL_IMAGE_TEXT, 2),
    partyId: process.env.PARTY_ID || undefined,
    partySize: process.env.PARTY_SIZE ? Number(process.env.PARTY_SIZE) : undefined,
    partyMax: process.env.PARTY_MAX ? Number(process.env.PARTY_MAX) : undefined,
    joinSecret: process.env.JOIN_SECRET || undefined,
    instance: false,
  };

  if (buttons.length > 0) {
    activity.buttons = buttons;
  }

  return activity;
};

const setActivity = async () => {
  if (!rpc) return;
  try {
    await rpc.setActivity(buildActivity());
    if (!hasLoggedActive) {
      console.log("Rich Presence aktif.");
      hasLoggedActive = true;
    }
  } catch (error) {
    console.error("Presence ayarlanirken hata:", error.message);
  }
};

rpc.on("ready", async () => {
  await setActivity();
  setInterval(setActivity, 15 * 1000);
});

rpc.login({ clientId }).catch((error) => {
  console.error("Discord'a baglanamadi:", error.message);
  console.error("Discord uygulamasinin acik oldugundan emin olun.");
});

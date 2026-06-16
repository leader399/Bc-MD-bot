require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadContentFromMessage, jidNormalizedUser, Browsers, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const { OpenAI } = require('openai');

// ═══════════════════════════════════════════════════════════════
// CIPHER MD - VIP PROFESSIONAL WHATSAPP BOT
// Owner: LEADER CIPHER
// Telegram: @Cipher4n
// Group: https://chat.whatsapp.com/HCtKQ6Us4RUFH8ZBiMkQu8
// Channel: https://whatsapp.com/channel/0029VbC17wYJZg43PhGmZv3f
// ═══════════════════════════════════════════════════════════════

// Import Commands
const commands = {
    song: require('./commands/song'),
    video: require('./commands/video'),
    kick: require('./commands/kick'),
    private: require('./commands/private'),
    public: require('./commands/public'),
    owner: require('./commands/owner'),
    ai: require('./commands/ai'),
    antilink: require('./commands/antilink'),
    anticall: require('./commands/anticall'),
    status: require('./commands/status'),
    antidelete: require('./commands/antidelete'),
    ping: require('./commands/ping'),
    autoreacts: require('./commands/autoreacts'),
    hidetag: require('./commands/hidetag'),
    tagall: require('./commands/tagall'),
    setname: require('./commands/setname'),
    insta: require('./commands/insta'),
    tiktok: require('./commands/tiktok'),
    dp: require('./commands/dp'),
    vv: require('./commands/vv'),
    joke: require('./commands/joke'),
    meme: require('./commands/meme'),
    groupinfo: require('./commands/groupinfo'),
    gdrive: require('./commands/gdrive'),
    mf: require('./commands/mf'),
    translate: require('./commands/translate').handleTranslateCommand,
    autostatus: require('./commands/status'),
    apk: require('./commands/apk'),
    autoread: require('./commands/autoread').autoreadCommand,
    character: require('./commands/character'),
    emojimix: require('./commands/emojimix'),
    facebook: require('./commands/facebook'),
    hack: require('./commands/hack'),
    accept: require('./commands/accept'),
    kickoffline: require('./commands/kickoffline'),
    antistatus: require('./commands/antistatus'),

    // ═══════════════════════════════════════════════
    // NEW VIP COMMANDS
    // ═══════════════════════════════════════════════
    start: require('./commands/start'),
    pair: require('./commands/pair'),
    despair: require('./commands/despair'),
    jid: require('./commands/jid'),
};

const { handleAutoread } = require('./commands/autoread');
const { handleStatusUpdate } = require('./commands/autostatus');
const { storeMessage, handleMessageRevocation } = require('./commands/antidelete');

const app = express();
const server = http.createServer(app);

// ═══════════════════════════════════════════════
// CIPHER MD CONFIGURATION
// ═══════════════════════════════════════════════
const CIPHER_CONFIG = {
    BOT_NAME: '𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗',
    OWNER_NAME: '𝗟𝗘𝗔𝗗𝗘𝗥 𝗖𝗜𝗣𝗛𝗘𝗥',
    TELEGRAM_ID: '@Cipher4n',
    GROUP_LINK: 'https://chat.whatsapp.com/HCtKQ6Us4RUFH8ZBiMkQu8',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbC17wYJZg43PhGmZv3f',
    VERSION: '3.0.0 VIP',
    YEAR: '2026'
};

// Telegram Bot Setup
const tgToken = process.env.TELEGRAM_BOT_TOKEN || "8852645155:AAEhJFZhkxChUnSBOTEBiCbIR6Wykc0DF0E";
const tgBot = new TelegramBot(tgToken, { polling: true });

// ═══════════════════════════════════════════════
// VIP WELCOME MESSAGE FOR TELEGRAM
// ═══════════════════════════════════════════════
tgBot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from.username || msg.from.first_name || 'User';

    if (text === '/start') {
        const vipWelcome = `
╔══════════════════════════════════════╗
║     🛡️ 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 - 𝗩𝗜𝗣 𝗘𝗗𝗜𝗧𝗜𝗢𝗡 🛡️     ║
╠══════════════════════════════════════╣
║                                      ║
║  👤 𝗪𝗘𝗟𝗖𝗢𝗠𝗘, ${username.toUpperCase()}!       ║
║                                      ║
║  🤖 𝗕𝗢𝗧: 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 𝘃${CIPHER_CONFIG.VERSION}    ║
║  👑 𝗢𝗪𝗡𝗘𝗥: ${CIPHER_CONFIG.OWNER_NAME}      ║
║  📱 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠: ${CIPHER_CONFIG.TELEGRAM_ID}        ║
║                                      ║
╠══════════════════════════════════════╣
║  🔗 𝗠𝗨𝗦𝗧 𝗝𝗢𝗜𝗡 𝗕𝗘𝗙𝗢𝗥𝗘 𝗣𝗔𝗜𝗥𝗜𝗡𝗚:       ║
║                                      ║
║  📢 𝗖𝗛𝗔𝗡𝗡𝗘𝗟:                        ║
║  ${CIPHER_CONFIG.CHANNEL_LINK}
║                                      ║
║  👥 𝗚𝗥𝗢𝗨𝗣:                          ║
║  ${CIPHER_CONFIG.GROUP_LINK}
║                                      ║
╠══════════════════════════════════════╣
║  ✨ 𝗘𝗡𝗧𝗘𝗥 𝗬𝗢𝗨𝗥 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗡𝗨𝗠𝗕𝗘𝗥      ║
║  📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 923000000000            ║
╚══════════════════════════════════════╝
`;
        await tgBot.sendMessage(chatId, vipWelcome);
        return;
    }

    // Check if user has joined group and channel (verification)
    if (/^\d+$/.test(text)) {
        const userId = chatId.toString();

        // Verify membership first
        if (!sessions[userId]) {
            sessions[userId] = new BotSession(userId);
        }

        if (!botData.statusSettings[userId]) {
            botData.statusSettings[userId] = { 
                autoStatus: false,
                autoSeen: false,
                autoLike: false,
                autoDownload: false,
                isPublic: false,
                verified: false
            };
            saveBotData();
        }

        const verifyMsg = `
⚠️ **𝗩𝗘𝗥𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗** ⚠️

𝗕𝗲𝗳𝗼𝗿𝗲 𝗽𝗮𝗶𝗿𝗶𝗻𝗴, 𝘆𝗼𝘂 𝗠𝗨𝗦𝗧 𝗷𝗼𝗶𝗻:

📢 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${CIPHER_CONFIG.CHANNEL_LINK}
👥 𝗚𝗿𝗼𝘂𝗽: ${CIPHER_CONFIG.GROUP_LINK}

✅ 𝗔𝗳𝘁𝗲𝗿 𝗷𝗼𝗶𝗻𝗶𝗻𝗴, 𝘁𝘆𝗽𝗲 /verify
🔄 𝗧𝗵𝗲𝗻 𝘀𝗲𝗻𝗱 𝘆𝗼𝘂𝗿 𝗻𝘂𝗺𝗯𝗲𝗿 𝗮𝗴𝗮𝗶𝗻: ${text}
`;

        if (!botData.statusSettings[userId].verified) {
            await tgBot.sendMessage(chatId, verifyMsg, { parse_mode: 'Markdown' });
            return;
        }

        await tgBot.sendMessage(chatId, "⏳ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲 𝗳𝗼𝗿 " + text + "...");
        sessions[userId].tgChatId = chatId;
        await sessions[userId].initialize(text);
    }

    if (text === '/verify') {
        botData.statusSettings[chatId.toString()].verified = true;
        saveBotData();
        await tgBot.sendMessage(chatId, "✅ 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱! 𝗡𝗼𝘄 𝘀𝗲𝗻𝗱 𝘆𝗼𝘂𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗽𝗮𝗶𝗿.");
    }
});

const io = socketIo(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1"
        });
    } catch (e) {}
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const AUTH_DIR = './auth_info';
const DATA_FILE = './data/bot_data.json';
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync('./data');

let botData = { 
    antilinkGroups: {}, 
    totalBots: 0, 
    registeredBots: [], 
    statusSettings: {}, 
    antiDelete: {}, 
    userNames: {}, 
    antiCall: {},
    antiStatusGroups: {}
};

if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}

function saveBotData() {
    fs.writeJsonSync(DATA_FILE, botData);
}

const sessions = {}; 
const userSockets = {}; 
const messageLogs = {}; 

// ═══════════════════════════════════════════════
// VIP TEXT STYLING
// ═══════════════════════════════════════════════
const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

// ═══════════════════════════════════════════════
// VIP BANNER GENERATOR
// ═══════════════════════════════════════════════
const getVIPBanner = () => {
    return `
╔══════════════════════════════════════════╗
║  🛡️ ${toBold("CIPHER MD")} - ${toBold("VIP EDITION")} 🛡️  ║
╠══════════════════════════════════════════╣
║  👑 ${toBold("Owner:")} ${toBold("LEADER CIPHER")}           ║
║  📱 ${toBold("Telegram:")} @Cipher4n                  ║
║  🔗 ${toBold("Group:")} Link Below                   ║
║  📢 ${toBold("Channel:")} Link Below                 ║
╚══════════════════════════════════════════╝
`;
};

async function loadExistingSessions() {
    try {
        const authDirs = await fs.readdir(AUTH_DIR);
        for (const userId of authDirs) {
            const authPath = path.join(AUTH_DIR, userId);
            const stats = await fs.stat(authPath);
            if (stats.isDirectory()) {
                const credsFile = path.join(authPath, 'creds.json');
                if (fs.existsSync(credsFile)) {
                    console.log(`[CIPHER] Found existing session for: ${userId}. Initializing...`);
                    if (!sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        sessions[userId].initialize().catch(err => {
                            console.error(`[CIPHER] Failed to auto-initialize session ${userId}:`, err.message);
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error('[CIPHER] Error loading existing sessions:', err.message);
    }
}

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.aiEnabled = false; 
        this.autoReact = botData.statusSettings[userId]?.autoReact || false;
        this.isPublic = botData.statusSettings[userId]?.isPublic || false; 
        this.authPath = path.join(AUTH_DIR, userId);
        this.processedMessages = new Set();
        this.activeInterval = null;
        this.isInitializing = false;
        this.userChats = {}; 
        this.lastConnectMessageTime = null;
    }

    sendLog(message, type = 'info') {
        const logEntry = { timestamp: new Date().toLocaleTimeString(), message, type };
        const socketId = userSockets[this.userId];
        if (socketId) io.to(socketId).emit('console', logEntry);
        console.log(`[CIPHER-${this.userId}] ${message}`);
    }

    sendConnectionStatus() {
        const socketId = userSockets[this.userId];
        if (socketId) {
            io.to(socketId).emit('connection-status', {
                connected: this.isConnected,
                user: this.userId
            });
        }
        io.emit('total-active', Object.values(sessions).filter(s => s.isConnected).length);
    }

    async getAIResponse(userJid, userMessage) {
        if (!openai) return "❌ AI is not configured.";
        try {
            const completion = await openai.chat.completions.create({
                model: process.env.AI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are CIPHER MD, a VIP WhatsApp bot created by LEADER CIPHER. Be helpful and professional." }, { role: "user", content: userMessage }],
                max_tokens: 150
            });
            return completion.choices[0].message.content.trim();
        } catch (error) {
            return "❌ AI Error: " + error.message;
        }
    }

    startActiveCheck() {
        if (this.activeInterval) clearInterval(this.activeInterval);
        this.activeInterval = setInterval(async () => {
            if (this.isConnected && this.sock?.user) {
                try {
                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    await this.sock.sendMessage(botNumber, { 
                        text: `🛡️ ${toBold("CIPHER MD")} ${toBold("IS ONLINE")} ⚡\n\n_${toBold("24/7 VIP System Active...")}_` 
                    });
                    this.sendLog("24/7 VIP Keep-alive sent. ✅", "success");
                } catch (e) {
                    this.sendLog("Keep-alive failed: " + e.message, "error");
                }
            }
        }, 60 * 60 * 1000);
    }

    async initialize(pairingNumber = null) {
        if (this.isInitializing) {
            this.sendLog("Initialization already in progress...", "info");
            return;
        }
        this.isInitializing = true;
        try {
            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);

            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: P({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome'),
                syncFullHistory: false,
                shouldSyncHistoryMessage: () => false,
                markOnlineOnConnect: true,
                keepAliveIntervalMs: 30000,
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                emitOwnEvents: true,
                retryRequestDelayMs: 5000,
                maxMsgRetryCount: 5,
                linkPreviewImageThumbnailWidth: 192,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                getMessage: async (key) => {
                    if (messageLogs[key.id]) {
                        return { conversation: messageLogs[key.id].text };
                    }
                    return { conversation: 'CIPHER MD is active' };
                },
                patchMessageBeforeSending: (message) => {
                    const requiresPatch = !!(
                        message.buttonsMessage ||
                        message.templateMessage ||
                        message.listMessage
                    );
                    if (requiresPatch) {
                        return {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    ...message
                                }
                            }
                        };
                    }
                    return message;
                },
                generateHighQualityLinkPreview: true,
            });

            if (pairingNumber && !state.creds.registered) {
                if (!this.sock.authState.creds.registered) {
                    await delay(3000);
                    try {
                        let code = await this.sock.requestPairingCode(pairingNumber);
                        code = code?.match(/.{1,4}/g)?.join("-") || code;
                        this.sendLog(`🔑 VIP Pairing Code: ${code}`, 'success');

                        if (this.tgChatId) {
                            const pairMsg = `
╔══════════════════════════════════════╗
║     🔑 𝗩𝗜𝗣 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 🔑            ║
╠══════════════════════════════════════╣
║                                      ║
║  🔐 𝗖𝗼𝗱𝗲: ${code}                    ║
║                                      ║
║  📲 𝗘𝗻𝘁𝗲𝗿 𝘁𝗵𝗶𝘀 𝗶𝗻 𝘆𝗼𝘂𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽    ║
║  ⚡ 𝗟𝗶𝗻𝗸𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀 > 𝗟𝗶𝗻𝗸 𝗗𝗲𝘃𝗶𝗰𝗲   ║
║                                      ║
╚══════════════════════════════════════╝
`;
                            await tgBot.sendMessage(this.tgChatId, pairMsg);
                        }

                        const socketId = userSockets[this.userId];
                        if (socketId) io.to(socketId).emit('pairing-code', code);
                    } catch (err) {
                        this.sendLog(`❌ Pairing error: ${err.message}`, 'error');
                        if (this.tgChatId) {
                            await tgBot.sendMessage(this.tgChatId, "❌ 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗘𝗿𝗿𝗼𝗿: " + err.message);
                        }
                    }
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('call', async (calls) => {
                if (botData.antiCall[this.userId]) {
                    for (const call of calls) {
                        if (call.status === 'offer') {
                            try {
                                await this.sock.rejectCall(call.id, call.from);
                                await this.sock.sendMessage(call.from, { 
                                    text: `🛡️ *${toBold("CIPHER MD - ANTI-CALL")}*\n\n📞 𝗜 𝗱𝗼𝗻'𝘁 𝗮𝗰𝗰𝗲𝗽𝘁 𝗰𝗮𝗹𝗹𝘀 ❌\n💬 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗶𝗻𝘀𝘁𝗲𝗮𝗱.` 
                                });
                            } catch (e) {}
                        }
                    }
                }
            });

            this.sock.ev.on('messages.upsert', async (m) => {
                if (m.type !== 'notify') return;

                await Promise.all(m.messages.map(async (msg) => {
                    if (msg.messageStubType === 1 || msg.messageStubType === 2) {
                        this.sendLog('Received undecryptable message.', 'warning');
                    }

                    try {
                        const from = msg.key.remoteJid;
                        const isMe = msg.key.fromMe;
                        const isGroup = from.endsWith('@g.us');
                        const isStatus = from === 'status@broadcast';

                        const messageContent = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message;
                        if (!messageContent) return;

                        let type = Object.keys(messageContent)[0];
                        const text = (messageContent.conversation || messageContent.extendedTextMessage?.text || messageContent.imageMessage?.caption || messageContent.videoMessage?.caption || '').trim();

                        if (!isMe && !isStatus) {
                            await handleAutoread(this.sock, msg);
                            await storeMessage(msg);
                        }

                        if (msg.message?.protocolMessage?.type === 0) {
                            await handleMessageRevocation(this.sock, msg);
                            return;
                        }

                        const msgId = msg.key.id;
                        if (this.processedMessages.has(msgId)) return;
                        this.processedMessages.add(msgId);
                        if (this.processedMessages.size > 1000) this.processedMessages.delete(this.processedMessages.values().next().value);

                        if (!isStatus) {
                            let logEntry = { text, type };
                            if (['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
                                try {
                                    const mContent = messageContent[type];
                                    if (mContent && (mContent.directPath || mContent.url)) {
                                        const stream = await downloadContentFromMessage(mContent, type.replace('Message', ''));
                                        let buffer = Buffer.from([]);
                                        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                                        logEntry.buffer = buffer;
                                    }
                                } catch (e) {}
                            }
                            logEntry.pushName = msg.pushName || 'User';
                            messageLogs[msgId] = logEntry;
                            if (Object.keys(messageLogs).length > 2000) delete messageLogs[Object.keys(messageLogs)[0]];
                        }

                        if (this.autoReact && !isMe && !isStatus) {
                            const emojis = ['❤️', '👍', '🔥', '👏', '😮', '😀', '🙌', '✨', '⭐', '✅', '🤖', '⚡', '🌟', '💯', '🌈', '💎', '👑', '🎉', '🧿', '🍀', '😗', '🤍', '🥀', '🤭', '🇵🇰', '🫢', '🫣'];
                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                            try { await this.sock.sendMessage(from, { react: { text: randomEmoji, key: msg.key } }); } catch (e) {}
                        }

                        if (this.aiEnabled && !isMe && !isStatus && !isGroup && text && !text.startsWith('.')) {
                            try {
                                const aiResponse = await this.getAIResponse(from, text);
                                await this.sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
                            } catch (e) {
                                console.error("AI Auto-Reply Error:", e);
                            }
                        }

                        if (isStatus && !isMe) {
                            await handleStatusUpdate(this.sock, m, botData, this.userId);
                            return;
                        }

                        const botNumber = jidNormalizedUser(this.sock.user.id);
                        const sender = msg.key.participant || from;
                        const isOwner = isMe || sender.includes(botNumber.split('@')[0]);
                        let isAdmin = isOwner;
                        if (!isAdmin && isGroup) {
                            try {
                                const groupMetadata = await this.sock.groupMetadata(from);
                                const participant = groupMetadata.participants.find(p => p.id === sender);
                                isAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
                            } catch (e) {
                                isAdmin = false;
                            }
                        }
                        const cmd = text.toLowerCase();
                        const args = text.split(' ').slice(1);
                        const q = args.join(' ');

                        if (isGroup && botData.antiStatusGroups && botData.antiStatusGroups[from] && !isAdmin) {
                            const isStatusMsg = msg.message?.protocolMessage?.type === 0 || 
                                           msg.message?.viewOnceMessage || 
                                           msg.message?.viewOnceMessageV2 ||
                                           msg.message?.viewOnceMessageV2Extension ||
                                           (text && (text.includes('whatsapp.com/channel/') || text.includes('status@broadcast')));

                            if (msg.message?.forwardingScore > 0 || isStatusMsg) {
                                try {
                                    await this.sock.sendMessage(from, { delete: msg.key });
                                    return;
                                } catch (e) {}
                            }
                        }

                        if (isGroup && botData.antilinkGroups[from] && !isAdmin) {
                            const linkPatterns = [/chat.whatsapp.com\//i, /http:\/\//i, /https:\/\//i, /www\./i, /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i];
                            if (linkPatterns.some(pattern => pattern.test(text))) {
                                try {
                                    const mode = botData.antilinkGroups[from];
                                    await this.sock.sendMessage(from, { delete: msg.key });
                                    if (mode === 'kick') await this.sock.groupParticipantsUpdate(from, [sender], "remove");
                                } catch (e) {}
                                return;
                            }
                        }

                        if (!this.isPublic && !isOwner) return;

                        if (cmd.startsWith('.')) {
                            const commandName = cmd.slice(1).split(' ')[0];
                            (async () => {
                                try {
                                    switch (commandName) {
                                        // ═══════════════════════════════════════════════
                                        // VIP COMMANDS - CIPHER MD
                                        // ═══════════════════════════════════════════════
                                        case 'start':
                                            await commands.start(this.sock, from, msg, this, CIPHER_CONFIG);
                                            break;
                                        case 'pair':
                                            await commands.pair(this.sock, from, msg, this, args, CIPHER_CONFIG);
                                            break;
                                        case 'despair':
                                            await commands.despair(this.sock, from, msg, this, CIPHER_CONFIG);
                                            break;
                                        case 'jid':
                                            await commands.jid(this.sock, from, msg, args, CIPHER_CONFIG);
                                            break;

                                        case 'menu':
                                            const loadEmojis = ['⏳', '⌛', '👀', '🏃🏻'];
                                            for (const emoji of loadEmojis) await this.sock.sendMessage(from, { react: { text: emoji, key: msg.key } });
                                            const customName = botData.userNames[this.userId] || msg.pushName || 'User';
                                            const menuText = `╭━━━〔 ${toBold("𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗")} 〕━━━┈⊷\n` +
                                                           `┃ 👤 ${toBold("User:")} ${customName}\n` +
                                                           `┃ 🤖 ${toBold("Status:")} ${toBold("Online ✅")}\n` +
                                                           `┃ ⚙️ ${toBold("Mode:")} ${this.isPublic ? toBold('Public 🌍') : toBold('Private 🔐')}\n` +
                                                           `┃ 👑 ${toBold("Owner:")} ${toBold("LEADER CIPHER")}\n` +
                                                           `┃ 📱 ${toBold("Telegram:")} @Cipher4n\n` +
                                                           `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                                                           `╭━━━〔 ${toBold("𝗩𝗜𝗣 𝗖𝗠𝗗𝗦")} 〕━━━┈⊷\n` +
                                                           `┃ ⋄ ${toBold(".𝘀𝘁𝗮𝗿𝘁")} - 𝗪𝗲𝗹𝗰𝗼𝗺𝗲\n` +
                                                           `┃ ⋄ ${toBold(".𝗽𝗮𝗶𝗿")} - 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲\n` +
                                                           `┃ ⋄ ${toBold(".𝗱𝗲𝘀𝗽𝗮𝗶𝗿")} - 𝗗𝗶𝘀𝗰𝗼𝗻𝗻𝗲𝗰𝘁\n` +
                                                           `┃ ⋄ ${toBold(".𝗷𝗶𝗱")} - 𝗘𝘅𝘁𝗿𝗮𝗰𝘁 𝗝𝗜𝗗\n` +
                                                           `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                                                           `╭━━━〔 ${toBold("𝗨𝗦𝗘𝗥 𝗖𝗠𝗗𝗦")} 〕━━━┈⊷\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝘂𝘁𝗼𝗿𝗲𝗮𝗰𝘁𝘀 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸 [𝗼𝗻/𝗼𝗳𝗳/𝗸𝗶𝗰𝗸]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗻𝘁𝗶𝗱𝗲𝗹𝗲𝘁𝗲 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗶 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘃𝘃")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗼𝘄𝗻𝗲𝗿")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗱𝗽")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗽𝗶𝗻𝗴")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘁𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲 (𝘁𝗲𝘅𝘁)")}\n` +
                                                           `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                                                           `╭━━━〔 ${toBold("𝗧𝗢𝗢𝗟𝗦")} 〕━━━┈⊷\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗽𝗸 (𝗻𝗮𝗺𝗲)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸 (𝘂𝗿𝗹)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘁𝗶𝗸𝘁𝗼𝗸 (𝘂𝗿𝗹)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗶𝗻𝘀𝘁𝗮 (𝘂𝗿𝗹)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘀𝗼𝗻𝗴 (𝗻𝗮𝗺𝗲)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘃𝗶𝗱𝗲𝗼 (𝗻𝗮𝗺𝗲)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗷𝗼𝗸𝗲")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗺𝗲𝗺𝗲")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 (𝗲𝟭+𝗲𝟮)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 (𝗺𝗲𝗻𝘁𝗶𝗼𝗻)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗴𝗱𝗿𝗶𝘃𝗲 (𝘂𝗿𝗹)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗺𝗳 (𝘂𝗿𝗹)")}\n` +
                                                           `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                                                           `╭━━━〔 ${toBold("𝗔𝗗𝗠𝗜𝗡")} 〕━━━┈⊷\n` +
                                                           `┃ ⋄ ${toBold(".𝗽𝗿𝗶𝘃𝗮𝘁𝗲")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗽𝘂𝗯𝗹𝗶𝗰")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝘂𝘁𝗼𝗿𝗲𝗮𝗱 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘀𝘁𝗮𝘁𝘂𝘀 [𝗼𝗻/𝗼𝗳𝗳/𝘀𝗲𝗲𝗻/𝗹𝗶𝗸𝗲/𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱/𝘀𝘆𝘀𝘁𝗲𝗺]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗵𝗮𝗰𝗸")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗵𝗶𝗱𝗲𝘁𝗮𝗴")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘁𝗮𝗴𝗮𝗹𝗹")}\n` +
                                                           `┃ ⋄ ${toBold(".𝘀𝗲𝘁𝗻𝗮𝗺𝗲 (𝗻𝗮𝗺𝗲)")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗻𝘁𝗶𝗰𝗮𝗹𝗹 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗸𝗶𝗰𝗸𝗼𝗳𝗳𝗹𝗶𝗻𝗲 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗻𝘁𝗶𝘀𝘁𝗮𝘁𝘂𝘀 [𝗼𝗻/𝗼𝗳𝗳]")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼")}\n` +
                                                           `┃ ⋄ ${toBold(".𝗮𝗰𝗰𝗲𝗽𝘁")}\n` +
                                                           `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                                                           `🤖 ${toBold("𝗔𝗰𝘁𝗶𝘃𝗲 𝗙𝗲𝗮𝘁𝘂𝗿𝗲:")}\n` +
                                                           `• ${toBold("𝗔𝗜:")} ${this.aiEnabled ? '✅' : '❌'}\n` +
                                                           `• ${toBold("𝗔𝘂𝘁𝗼-𝗥𝗲𝗮𝗰𝘁𝘀:")} ${this.autoReact ? '✅' : '❌'}\n` +
                                                           `• ${toBold("𝗔𝗻𝘁𝗶-𝗗𝗲𝗹𝗲𝘁𝗲:")} ${botData.antiDelete[this.userId] ? '✅' : '❌'}\n` +
                                                           `• ${toBold("𝗔𝘂𝘁𝗼-𝗦𝘁𝗮𝘁𝘂𝘀:")} ${(botData.statusSettings[this.userId] && botData.statusSettings[this.userId].autoStatus) ? '✅' : '❌'}\n\n` +
                                                           `🔗 ${toBold("𝗚𝗥𝗢𝗨𝗣:")}\n` +
                                                           `> ${CIPHER_CONFIG.GROUP_LINK}\n\n` +
                                                           `📢 ${toBold("𝗖𝗛𝗔𝗡𝗡𝗘𝗟:")}\n` +
                                                           `> ${CIPHER_CONFIG.CHANNEL_LINK}\n\n` +
                                                           `⚡ ${toBold("𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: CIPHER MD")}\n` +
                                                           `👑 ${toBold("𝗢𝗪𝗡𝗘𝗥: LEADER CIPHER")}`;
                                            try {
                                                await this.sock.sendMessage(from, { image: { url: 'https://i.postimg.cc/Hk7bjLLW/file-000000000a14720684ad6e0dd7007e3d.png' }, caption: menuText });
                                            } catch (e) { await this.sock.sendMessage(from, { text: menuText }); }
                                            break;

                                        case 'ping': await commands.ping(this.sock, from, msg); break;
                                        case 'owner': await commands.owner(this.sock, from, msg); break;
                                        case 'ai': await commands.ai(this.sock, from, msg, isAdmin, this, args); break;
                                        case 'antilink': await commands.antilink(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        case 'anticall': await commands.anticall(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'antidelete': await commands.antidelete(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'status': 
                                        case 'autostatus': await commands.autostatus(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'autoreacts': await commands.autoreacts(this.sock, from, msg, isAdmin, this, args); break;
                                        case 'kick': await commands.kick(this.sock, from, msg, isAdmin); break;
                                        case 'private': 
                                            await commands.private(this.sock, from, msg, isAdmin, this); 
                                            if (!botData.statusSettings[this.userId]) botData.statusSettings[this.userId] = {};
                                            botData.statusSettings[this.userId].isPublic = false;
                                            saveBotData();
                                            break;
                                        case 'public': 
                                            await commands.public(this.sock, from, msg, isAdmin, this); 
                                            if (!botData.statusSettings[this.userId]) botData.statusSettings[this.userId] = {};
                                            botData.statusSettings[this.userId].isPublic = true;
                                            saveBotData();
                                            break;
                                        case 'hidetag': await commands.hidetag(this.sock, from, msg, isAdmin, q); break;
                                        case 'tagall': await commands.tagall(this.sock, from, msg, isAdmin, q); break;
                                        case 'setname': await commands.setname(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, q); break;
                                        case 'insta': case 'ig': await commands.insta(this.sock, from, msg, q); break;
                                        case 'tiktok': await commands.tiktok(this.sock, from, msg, q); break;
                                        case 'song': await commands.song(this.sock, from, msg); break;
                                        case 'video': await commands.video(this.sock, from, msg); break;
                                        case 'joke': await commands.joke(this.sock, from, msg); break;
                                        case 'meme': await commands.meme(this.sock, from, msg); break;
                                        case 'vv': await commands.vv(this.sock, from, msg); break;
                                        case 'dp': await commands.dp(this.sock, from, msg); break;
                                        case 'groupinfo': await commands.groupinfo(this.sock, from, msg); break;
                                        case 'kickoffline': await commands.kickoffline(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        case 'antistatus': await commands.antistatus(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        case 'gdrive': await commands.gdrive(this.sock, from, msg, q); break;
                                        case 'mf': await commands.mf(this.sock, from, msg, q); break;
                                        case 'translate': case 'trt': await commands.translate(this.sock, from, msg); break;
                                        case 'apk': await commands.apk(this.sock, from, msg); break;
                                        case 'autoread': await commands.autoread(this.sock, from, msg); break;
                                        case 'character': await commands.character(this.sock, from, msg); break;
                                        case 'emojimix': await commands.emojimix(this.sock, from, msg); break;
                                        case 'facebook': case 'fb': await commands.facebook(this.sock, from, msg); break;
                                        case 'hack': await commands.hack(this.sock, from, msg); break;
                                        case 'accept': await commands.accept(this.sock, from, msg, isAdmin); break;
                                    }
                                } catch (e) {
                                    this.sendLog(`Command error (${commandName}): ` + e.message, 'error');
                                }
                            })();
                        }
                    } catch (e) {
                        console.error('Message Processing Error:', e);
                    }
                }));
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('qr', qr);
                }

                if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                    this.isConnected = false;
                    this.isInitializing = false;
                    this.sendLog(`Connection closed. Reconnecting: ${shouldReconnect}`, 'warning');
                    this.sendConnectionStatus();
                    const statusCode = (lastDisconnect.error)?.output?.statusCode;

                    if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                        this.sendLog('Session expired. Clearing auth data...', 'error');
                        try {
                            if (fs.existsSync(this.authPath)) {
                                const backupPath = `${this.authPath}_backup_${Date.now()}`;
                                fs.moveSync(this.authPath, backupPath);
                                this.sendLog(`Session backed up to ${backupPath}`, 'info');
                            }
                        } catch (e) {
                            if (fs.existsSync(this.authPath)) fs.removeSync(this.authPath);
                        }
                        delete sessions[this.userId];
                        this.sendConnectionStatus();
                    } else if (statusCode === DisconnectReason.restartRequired || statusCode === DisconnectReason.connectionLost || statusCode === 428) {
                        this.sendLog(`Connection issue (${statusCode}). Restarting in 3s...`, 'warning');
                        setTimeout(() => this.initialize(), 3000);
                    } else if (statusCode === 515) {
                        this.sendLog('Stream error. Reconnecting...', 'warning');
                        this.initialize();
                    } else {
                        this.sendLog(`Connection closed (${statusCode}). Reconnecting in 5s...`, 'info');
                        setTimeout(() => this.initialize(), 5000);
                    }
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    this.sendLog('Connected successfully! ✅', 'success');
                    this.sendConnectionStatus();
                    this.startActiveCheck();

                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    const botName = botData.userNames[this.userId] || (this.sock.user && this.sock.user.name) || this.userId;

                    if (this.tgChatId) {
                        const connectMsg = `
╔══════════════════════════════════════╗
║  ✅ 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!  ║
╠══════════════════════════════════════╣
║                                      ║
║  🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${toBold("CIPHER MD")}          ║
║  👑 𝗢𝘄𝗻𝗲𝗿: ${toBold("LEADER CIPHER")}            ║
║  📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: @Cipher4n              ║
║                                      ║
║  ✨ 𝗧𝘆𝗽𝗲 .𝗺𝗲𝗻𝘂 𝘁𝗼 𝘀𝗲𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀       ║
║                                      ║
╚══════════════════════════════════════╝
`;
                        await tgBot.sendMessage(this.tgChatId, connectMsg);
                    }

                    this.sendLog(`Bot ${botName} is online.`, 'success');

                    setTimeout(async () => {
                        try {
                            await this.sock.query({
                                tag: 'iq',
                                attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' },
                                content: [{ tag: 'status', attrs: {}, content: Buffer.from("🛡️ 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 - 𝗩𝗜𝗣 𝗘𝗗𝗜𝗧𝗜𝗢𝗡\n👑 𝗢𝘄𝗻𝗲𝗿: 𝗟𝗘𝗔𝗗𝗘𝗥 𝗖𝗜𝗣𝗛𝗘𝗥\n📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: @Cipher4n\n⚡ 24/7 𝗔𝗰𝘁𝗶𝘃𝗲", 'utf-8') }]
                            });
                            this.sendLog("Bio updated successfully! ✅", "success");
                        } catch (e) {
                            this.sendLog("Bio update failed: " + e.message, "error");
                        }
                    }, 5000);

                    if (!this.lastConnectMessageTime || (Date.now() - this.lastConnectMessageTime > 60 * 60 * 1000)) {
                        const welcomeConnect = `
🛡️ *${toBold("CIPHER MD")}* - *${toBold("VIP EDITION")}* 🛡️

✅ *${toBold("Connected Successfully!")}*

👑 *${toBold("Owner:")}* LEADER CIPHER
📱 *${toBold("Telegram:")}* @Cipher4n

🔗 *${toBold("Group:")}* ${CIPHER_CONFIG.GROUP_LINK}
📢 *${toBold("Channel:")}* ${CIPHER_CONFIG.CHANNEL_LINK}

⚡ *${toBold("Type .menu to see all commands")}*
`;
                        await this.sock.sendMessage(botNumber, { text: welcomeConnect });
                        this.lastConnectMessageTime = Date.now();
                    }
                }
            });

        } catch (err) {
            this.isInitializing = false;
            this.sendLog(`Initialization failed: ${err.message}. Retrying in 10s...`, 'error');
            setTimeout(() => this.initialize(), 10000);
        }
    }
}

io.on('connection', (socket) => {
    socket.on('set-user', (userId) => {
        userSockets[userId] = socket.id;
        if (!sessions[userId]) sessions[userId] = new BotSession(userId);
        sessions[userId].sendConnectionStatus();
    });

    socket.on('pair-request', async ({ userId, number }) => {
        if (sessions[userId]) {
            if (!botData.statusSettings[userId]) {
                botData.statusSettings[userId] = { 
                    autoStatus: false,
                    autoSeen: false,
                    autoLike: false,
                    autoDownload: false,
                    isPublic: false
                };
                saveBotData();
            }
            await sessions[userId].initialize(number);
        }
    });

    socket.on('logout', async (userId) => {
        if (sessions[userId]) {
            if (sessions[userId].sock) {
                try { await sessions[userId].sock.logout(); } catch (e) {}
            }
            const authPath = path.join(AUTH_DIR, userId);
            if (fs.existsSync(authPath)) fs.removeSync(authPath);
            delete sessions[userId];
            io.emit('total-active', Object.values(sessions).filter(s => s.isConnected).length);
            const socketId = userSockets[userId];
            if (socketId) io.to(socketId).emit('connection-status', { connected: false, user: userId });
        }
    });

    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🛡️ CIPHER MD Server running on http://localhost:${PORT}`);

    loadExistingSessions();

    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
    if (APP_URL) {
        setInterval(async () => {
            try {
                await axios.get(APP_URL);
                console.log("🛡️ CIPHER MD Anti-Sleep: Server Active ⚡");
            } catch (e) {
                console.log("Anti-Sleep Ping: " + e.message);
            }
        }, 5 * 60 * 1000);
    }
});

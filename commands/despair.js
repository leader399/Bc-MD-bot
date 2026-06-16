// ═══════════════════════════════════════════════════════════════
// CIPHER MD - DESPAIR COMMAND
// Disconnect/logout the bot
// Owner: LEADER CIPHER | Telegram: @Cipher4n
// ═══════════════════════════════════════════════════════════════

const fs = require('fs-extra');
const path = require('path');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

async function despairCommand(sock, from, msg, session, config) {
    try {
        const { BOT_NAME, OWNER_NAME, TELEGRAM_ID, GROUP_LINK, CHANNEL_LINK } = config;

        // Check if owner
        const botNumber = jidNormalizedUser(sock.user.id);
        const sender = msg.key.participant || from;
        const isOwner = sender.includes(botNumber.split('@')[0]);

        if (!isOwner) {
            await sock.sendMessage(from, { 
                text: "🚫 *𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗*\n\n❌ 𝗢𝗻𝗹𝘆 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗼𝘄𝗻𝗲𝗿 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.\n\n👑 𝗢𝘄𝗻𝗲𝗿: LEADER CIPHER\n📱 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: @Cipher4n" 
            }, { quoted: msg });
            return;
        }

        const confirmText = `
╔══════════════════════════════════════════╗
║     ⚠️ 𝗗𝗘𝗦𝗣𝗔𝗜𝗥 - 𝗗𝗜𝗦𝗖𝗢𝗡𝗡𝗘𝗖𝗧 ⚠️        ║
╠══════════════════════════════════════════╣
║                                          ║
║  🤖 𝗕𝗼𝘁: ${BOT_NAME}                   ║
║                                          ║
║  ⚠️ 𝗔𝗿𝗲 𝘆𝗼𝘂 𝘀𝘂𝗿𝗲 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼:         ║
║                                          ║
║  ❌ 𝗗𝗶𝘀𝗰𝗼𝗻𝗻𝗲𝗰𝘁 𝗳𝗿𝗼𝗺 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽         ║
║  🗑️ 𝗖𝗹𝗲𝗮𝗿 𝗮𝗹𝗹 𝘀𝗲𝘀𝘀𝗶𝗼𝗻 𝗱𝗮𝘁𝗮           ║
║  🔓 𝗟𝗼𝗴𝗼𝘂𝘁 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗹𝘆                 ║
║                                          ║
║  🔄 𝗧𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺, 𝘂𝘀𝗲:                   ║
║  .despair confirm                        ║
║                                          ║
║  ❌ 𝗧𝗼 𝗰𝗮𝗻𝗰𝗲𝗹, 𝘂𝘀𝗲:                    ║
║  .despair cancel                         ║
║                                          ║
╚══════════════════════════════════════════╝
`;

        // Store confirmation state (simple approach)
        global.despairConfirm = global.despairConfirm || {};
        global.despairConfirm[sender] = true;

        await sock.sendMessage(from, { text: confirmText }, { quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Error: " + e.message }, { quoted: msg });
    }
}

// Handle confirm/cancel
async function handleDespairConfirm(sock, from, msg, session, config, action) {
    try {
        const sender = msg.key.participant || from;

        if (action === 'confirm') {
            const disconnectingText = `
╔══════════════════════════════════════════╗
║     🔄 𝗗𝗜𝗦𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗡𝗚... 🔄              ║
╠══════════════════════════════════════════╣
║                                          ║
║  🤖 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 𝗶𝘀 𝗹𝗼𝗴𝗴𝗶𝗻𝗴 𝗼𝘂𝘁...       ║
║                                          ║
║  ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...                       ║
║                                          ║
╚══════════════════════════════════════════╝
`;
            await sock.sendMessage(from, { text: disconnectingText }, { quoted: msg });

            // Perform logout
            try {
                if (session && session.sock) {
                    await session.sock.logout();
                }

                // Clear auth data
                const AUTH_DIR = './auth_info';
                const authPath = path.join(AUTH_DIR, session.userId);
                if (fs.existsSync(authPath)) {
                    fs.removeSync(authPath);
                }

                const successText = `
╔══════════════════════════════════════════╗
║     ✅ 𝗗𝗜𝗦𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 ✅    ║
╠══════════════════════════════════════════╣
║                                          ║
║  🤖 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗹𝗼𝗴𝗴𝗲𝗱 𝗼𝘂𝘁    ║
║                                          ║
║  🗑️ 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 𝗱𝗮𝘁𝗮 𝗰𝗹𝗲𝗮𝗿𝗲𝗱              ║
║  🔓 𝗔𝘂𝘁𝗵𝗲𝗻𝘁𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗿𝗲𝗺𝗼𝘃𝗲𝗱           ║
║                                          ║
║  🔄 𝗧𝗼 𝗿𝗲𝗰𝗼𝗻𝗻𝗲𝗰𝘁:                      ║
║  📱 𝗨𝘀𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗯𝗼𝘁: @Cipher4n       ║
║  🔑 𝗢𝗿 𝘂𝘀𝗲 .pair 𝗰𝗼𝗺𝗺𝗮𝗻𝗱              ║
║                                          ║
║  👑 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗!   ║
║                                          ║
╚══════════════════════════════════════════╝
`;
                await sock.sendMessage(from, { text: successText }, { quoted: msg });

            } catch (logoutError) {
                await sock.sendMessage(from, { 
                    text: "❌ 𝗟𝗼𝗴𝗼𝘂𝘁 𝗘𝗿𝗿𝗼𝗿: " + logoutError.message 
                }, { quoted: msg });
            }

        } else if (action === 'cancel') {
            const cancelText = `
╔══════════════════════════════════════════╗
║     ❌ 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡 𝗖𝗔𝗡𝗖𝗘𝗟𝗟𝗘𝗗 ❌          ║
╠══════════════════════════════════════════╣
║                                          ║
║  🤖 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 𝗿𝗲𝗺𝗮𝗶𝗻𝘀 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱      ║
║                                          ║
║  ✅ 𝗡𝗼 𝗰𝗵𝗮𝗻𝗴𝗲𝘀 𝘄𝗲𝗿𝗲 𝗺𝗮𝗱𝗲               ║
║                                          ║
╚══════════════════════════════════════════╝
`;
            await sock.sendMessage(from, { text: cancelText }, { quoted: msg });
        }

        delete global.despairConfirm[sender];

    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Error: " + e.message }, { quoted: msg });
    }
}

module.exports = despairCommand;

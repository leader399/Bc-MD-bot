// ═══════════════════════════════════════════════════════════════
// CIPHER MD - START COMMAND
// Welcome message with VIP styling
// Owner: LEADER CIPHER | Telegram: @Cipher4n
// ═══════════════════════════════════════════════════════════════

async function startCommand(sock, from, msg, session, config) {
    try {
        const { BOT_NAME, OWNER_NAME, TELEGRAM_ID, GROUP_LINK, CHANNEL_LINK } = config;

        const welcomeText = `
╔══════════════════════════════════════════╗
║     🛡️ 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 - 𝗩𝗜𝗣 𝗘𝗗𝗜𝗧𝗜𝗢𝗡 🛡️      ║
╠══════════════════════════════════════════╣
║                                          ║
║  👋 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗!              ║
║                                          ║
║  🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${BOT_NAME}            ║
║  👑 𝗢𝗪𝗡𝗘𝗥: ${OWNER_NAME}           ║
║  📱 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠: ${TELEGRAM_ID}              ║
║  🔢 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: 3.0.0 VIP                   ║
║                                          ║
╠══════════════════════════════════════════╣
║  🚀 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:                 ║
║                                          ║
║  🔹 .start  - 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲           ║
║  🔹 .pair   - 𝗚𝗲𝘁 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲           ║
║  🔹 .despair - 𝗗𝗶𝘀𝗰𝗼𝗻𝗻𝗲𝗰𝘁 𝗕𝗼𝘁           ║
║  🔹 .jid    - 𝗘𝘅𝘁𝗿𝗮𝗰𝘁 𝗝𝗜𝗗 𝗳𝗿𝗼𝗺 𝗟𝗶𝗻𝗸    ║
║  🔹 .menu   - 𝗙𝘂𝗹𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁        ║
║                                          ║
╠══════════════════════════════════════════╣
║  🔗 𝗠𝗨𝗦𝗧 𝗝𝗢𝗜𝗡:                          ║
║                                          ║
║  📢 𝗖𝗛𝗔𝗡𝗡𝗘𝗟:                            ║
║  ${CHANNEL_LINK}
║                                          ║
║  👥 𝗚𝗥𝗢𝗨𝗣:                              ║
║  ${GROUP_LINK}
║                                          ║
╠══════════════════════════════════════════╣
║  ⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗              ║
║  👑 𝗢𝗪𝗡𝗘𝗥: 𝗟𝗘𝗔𝗗𝗘𝗥 𝗖𝗜𝗣𝗛𝗘𝗥               ║
╚══════════════════════════════════════════╝
`;

        await sock.sendMessage(from, { 
            text: welcomeText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363000000000000@newsletter',
                    newsletterName: 'CIPHER MD VIP',
                    serverMessageId: -1
                }
            }
        }, { quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Error: " + e.message }, { quoted: msg });
    }
}

module.exports = startCommand;

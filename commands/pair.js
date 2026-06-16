// ═══════════════════════════════════════════════════════════════
// CIPHER MD - PAIR COMMAND
// Generate pairing code for WhatsApp connection
// Owner: LEADER CIPHER | Telegram: @Cipher4n
// ═══════════════════════════════════════════════════════════════

async function pairCommand(sock, from, msg, session, args, config) {
    try {
        const { BOT_NAME, OWNER_NAME, TELEGRAM_ID, GROUP_LINK, CHANNEL_LINK } = config;

        // Check if number is provided
        if (!args[0]) {
            const usageText = `
╔══════════════════════════════════════════╗
║     🔑 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 - 𝗣𝗔𝗜𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 🔑      ║
╠══════════════════════════════════════════╣
║                                          ║
║  ❌ 𝗡𝗼 𝗻𝘂𝗺𝗯𝗲𝗿 𝗽𝗿𝗼𝘃𝗶𝗱𝗲𝗱!                 ║
║                                          ║
║  📌 𝗨𝗦𝗔𝗚𝗘:                               ║
║  .pair 923000000000                      ║
║                                          ║
║  📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:                           ║
║  .pair 923001234567                     ║
║  .pair 9230012345678                    ║
║                                          ║
║  ⚠️ 𝗠𝗮𝗸𝗲 𝘀𝘂𝗿𝗲 𝘁𝗼 𝗷𝗼𝗶𝗻:                  ║
║  📢 ${CHANNEL_LINK}
║  👥 ${GROUP_LINK}
║                                          ║
╚══════════════════════════════════════════╝
`;
            await sock.sendMessage(from, { text: usageText }, { quoted: msg });
            return;
        }

        const number = args[0];

        // Validate number format
        if (!/^\d{10,15}$/.test(number)) {
            await sock.sendMessage(from, { 
                text: "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿!\n\n📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 923000000000\n📝 𝗡𝗼 + 𝘀𝗶𝗴𝗻, 𝗻𝗼 𝘀𝗽𝗮𝗰𝗲𝘀" 
            }, { quoted: msg });
            return;
        }

        const processingText = `
╔══════════════════════════════════════════╗
║     ⏳ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 ⏳      ║
╠══════════════════════════════════════════╣
║                                          ║
║  📱 𝗡𝘂𝗺𝗯𝗲𝗿: ${number}                   ║
║                                          ║
║  ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...                      ║
║  🔐 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝗰𝗼𝗱𝗲 𝗳𝗿𝗼𝗺 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽      ║
║                                          ║
╚══════════════════════════════════════════╝
`;

        await sock.sendMessage(from, { text: processingText }, { quoted: msg });

        // Try to generate pairing code
        try {
            // Check if we can use the session's socket to generate code
            if (session && session.sock && session.sock.requestPairingCode) {
                let code = await session.sock.requestPairingCode(number);
                code = code?.match(/.{1,4}/g)?.join("-") || code;

                const successText = `
╔══════════════════════════════════════════╗
║     🔑 𝗩𝗜𝗣 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 🔑   ║
╠══════════════════════════════════════════╣
║                                          ║
║  📱 𝗡𝘂𝗺𝗯𝗲𝗿: ${number}                   ║
║                                          ║
║  🔐 𝗖𝗼𝗱𝗲: *${code}*                     ║
║                                          ║
║  📲 𝗛𝗢𝗪 𝗧𝗢 𝗨𝗦𝗘:                        ║
║  1️⃣ 𝗢𝗽𝗲𝗻 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽                      ║
║  2️⃣ 𝗚𝗼 𝘁𝗼 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀                     ║
║  3️⃣ 𝗧𝗮𝗽 𝗟𝗶𝗻𝗸𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀               ║
║  4️⃣ 𝗧𝗮𝗽 𝗟𝗶𝗻𝗸 𝗮 𝗗𝗲𝘃𝗶𝗰𝗲                  ║
║  5️⃣ 𝗘𝗻𝘁𝗲𝗿 𝘁𝗵𝗲 𝗰𝗼𝗱𝗲 𝗮𝗯𝗼𝘃𝗲              ║
║                                          ║
║  ⏳ 𝗖𝗼𝗱𝗲 𝗲𝘅𝗽𝗶𝗿𝗲𝘀 𝗶𝗻 𝟮 𝗺𝗶𝗻𝘂𝘁𝗲𝘀         ║
║                                          ║
╠══════════════════════════════════════════╣
║  ⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗              ║
║  👑 𝗢𝗪𝗡𝗘𝗥: 𝗟𝗘𝗔𝗗𝗘𝗥 𝗖𝗜𝗣𝗛𝗘𝗥               ║
╚══════════════════════════════════════════╝
`;

                await sock.sendMessage(from, { text: successText }, { quoted: msg });
            } else {
                // Fallback: Direct pairing via Telegram bot
                const fallbackText = `
╔══════════════════════════════════════════╗
║     🔑 𝗔𝗟𝗧𝗘𝗥𝗡𝗔𝗧𝗘 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗠𝗘𝗧𝗛𝗢𝗗 🔑    ║
╠══════════════════════════════════════════╣
║                                          ║
║  📱 𝗡𝘂𝗺𝗯𝗲𝗿: ${number}                   ║
║                                          ║
║  ⚠️ 𝗗𝗶𝗿𝗲𝗰𝘁 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 𝗻𝗼𝘁 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲      ║
║                                          ║
║  🔄 𝗨𝘀𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝗼𝘁:                  ║
║  @Cipher4n                              ║
║                                          ║
║  📲 𝗦𝘁𝗲𝗽𝘀:                             ║
║  1️⃣ 𝗢𝗽𝗲𝗻 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺                    ║
║  2️⃣ 𝗦𝗲𝗮𝗿𝗰𝗵 @Cipher4n                  ║
║  3️⃣ 𝗦𝘁𝗮𝗿𝘁 𝘁𝗵𝗲 𝗯𝗼𝘁                    ║
║  4️⃣ 𝗦𝗲𝗻𝗱 𝘆𝗼𝘂𝗿 𝗻𝘂𝗺𝗯𝗲𝗿                 ║
║  5️⃣ 𝗚𝗲𝘁 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 𝗰𝗼𝗱𝗲                  ║
║                                          ║
╚══════════════════════════════════════════╝
`;
                await sock.sendMessage(from, { text: fallbackText }, { quoted: msg });
            }
        } catch (pairError) {
            const errorText = `
╔══════════════════════════════════════════╗
║     ❌ 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗘𝗥𝗥𝗢𝗥 ❌                  ║
╠══════════════════════════════════════════╣
║                                          ║
║  📱 𝗡𝘂𝗺𝗯𝗲𝗿: ${number}                   ║
║                                          ║
║  ❌ 𝗘𝗿𝗿𝗼𝗿: ${pairError.message}         ║
║                                          ║
║  🔄 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿                    ║
║  📱 𝗢𝗿 𝘂𝘀𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗯𝗼𝘁: @Cipher4n    ║
║                                          ║
╚══════════════════════════════════════════╝
`;
            await sock.sendMessage(from, { text: errorText }, { quoted: msg });
        }

    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Error: " + e.message }, { quoted: msg });
    }
}

module.exports = pairCommand;

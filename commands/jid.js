// ═══════════════════════════════════════════════════════════════
// CIPHER MD - JID COMMAND
// Extract JID from WhatsApp group/channel link
// Owner: LEADER CIPHER | Telegram: @Cipher4n
// ═══════════════════════════════════════════════════════════════

async function jidCommand(sock, from, msg, args, config) {
    try {
        const { BOT_NAME, OWNER_NAME, TELEGRAM_ID, GROUP_LINK, CHANNEL_LINK } = config;

        // Check if link is provided
        if (!args[0]) {
            const usageText = `
╔══════════════════════════════════════════╗
║     🔍 𝗖𝗜𝗣𝗛𝗘𝗥 𝗠𝗗 - 𝗝𝗜𝗗 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗢𝗥 🔍    ║
╠══════════════════════════════════════════╣
║                                          ║
║  ❌ 𝗡𝗼 𝗹𝗶𝗻𝗸 𝗽𝗿𝗼𝘃𝗶𝗱𝗲𝗱!                   ║
║                                          ║
║  📌 𝗨𝗦𝗔𝗚𝗘:                               ║
║  .jid <group/channel link>               ║
║                                          ║
║  📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:                           ║
║  .jid https://chat.whatsapp.com/ABC123   ║
║  .jid https://whatsapp.com/channel/XYZ   ║
║                                          ║
║  🔗 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗟𝗶𝗻𝗸𝘀:                    ║
║  • Group Invite Links                    ║
║  • Channel Links                         ║
║  • Community Links                       ║
║                                          ║
╚══════════════════════════════════════════╝
`;
            await sock.sendMessage(from, { text: usageText }, { quoted: msg });
            return;
        }

        const link = args[0];

        // Validate and extract from group link
        const groupMatch = link.match(/chat\.whatsapp\.com\/(invite\/)?([a-zA-Z0-9]{10,25})/);
        const channelMatch = link.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]{10,30})/);

        let result = null;
        let type = '';

        if (groupMatch) {
            const inviteCode = groupMatch[2];
            type = 'Group';

            try {
                // Try to get group info from invite code
                const groupInfo = await sock.groupGetInviteInfo(inviteCode);

                if (groupInfo) {
                    result = {
                        jid: groupInfo.id,
                        name: groupInfo.subject || 'Unknown',
                        desc: groupInfo.desc || 'No description',
                        size: groupInfo.size || 0,
                        owner: groupInfo.owner || 'Unknown',
                        created: groupInfo.creation ? new Date(groupInfo.creation * 1000).toLocaleString() : 'Unknown',
                        inviteCode: inviteCode
                    };
                }
            } catch (e) {
                // If can't get info, generate probable JID
                result = {
                    jid: `${inviteCode}@g.us`,
                    name: 'Unknown (Private/Restricted)',
                    desc: 'Unable to fetch details',
                    size: 'Unknown',
                    owner: 'Unknown',
                    created: 'Unknown',
                    inviteCode: inviteCode
                };
            }

        } else if (channelMatch) {
            const channelId = channelMatch[1];
            type = 'Channel';

            result = {
                jid: `${channelId}@newsletter`,
                name: 'Channel (Newsletter)',
                desc: 'Channel info may be restricted',
                size: 'Unknown',
                owner: 'Unknown',
                created: 'Unknown',
                inviteCode: channelId
            };

        } else {
            await sock.sendMessage(from, { 
                text: "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗹𝗶𝗻𝗸!\n\n📌 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗳𝗼𝗿𝗺𝗮𝘁𝘀:\n• https://chat.whatsapp.com/XXXX\n• https://whatsapp.com/channel/XXXX" 
            }, { quoted: msg });
            return;
        }

        // Format and send result
        const resultText = `
╔══════════════════════════════════════════╗
║     🔍 𝗝𝗜𝗗 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 🔍   ║
╠══════════════════════════════════════════╣
║                                          ║
║  📋 𝗧𝘆𝗽𝗲: ${type}                        ║
║                                          ║
║  🔗 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹 𝗟𝗶𝗻𝗸:                       ║
║  ${link}                                 ║
║                                          ║
╠══════════════════════════════════════════╣
║  📊 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗘𝗗 𝗗𝗔𝗧𝗔:                     ║
║                                          ║
║  🆔 𝗝𝗜𝗗:                                 ║
║  ${result.jid}                           ║
║                                          ║
║  📝 𝗡𝗮𝗺𝗲: ${result.name}                 ║
║  📄 𝗗𝗲𝘀𝗰: ${result.desc}                 ║
║  👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${result.size}             ║
║  👤 𝗢𝘄𝗻𝗲𝗿: ${result.owner}               ║
║  📅 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${result.created}           ║
║                                          ║
╠══════════════════════════════════════════╣
║  💡 𝗨𝗦𝗔𝗚𝗘:                              ║
║  𝗨𝘀𝗲 𝘁𝗵𝗶𝘀 𝗝𝗜𝗗 𝗶𝗻 𝗼𝘁𝗵𝗲𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀      ║
║                                          ║
╚══════════════════════════════════════════╝
`;

        await sock.sendMessage(from, { text: resultText }, { quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Error: " + e.message }, { quoted: msg });
    }
}

module.exports = jidCommand;

// ═══════════════════════════════════════════════════════════════
// CIPHER MD - SETTINGS CONFIGURATION
// VIP Professional Bot Settings
// Owner: LEADER CIPHER | Telegram: @Cipher4n
// ═══════════════════════════════════════════════════════════════

module.exports = {
    giphyApiKey: process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC',
    ownerNumber: process.env.OWNER_TELEGRAM || '@Cipher4n',
    botName: 'CIPHER MD',
    ownerName: 'LEADER CIPHER',

    // VIP Configuration
    vipConfig: {
        version: '3.0.0 VIP',
        year: '2026',
        telegramId: '@Cipher4n',
        groupLink: 'https://chat.whatsapp.com/HCtKQ6Us4RUFH8ZBiMkQu8',
        channelLink: 'https://whatsapp.com/channel/0029VbC17wYJZg43PhGmZv3f',
        banner: '🛡️ CIPHER MD - VIP EDITION 🛡️'
    },

    // Bot Features
    features: {
        antiCall: true,
        antiDelete: true,
        antiLink: true,
        autoReact: true,
        autoRead: true,
        autoStatus: true,
        aiReply: true
    }
};

const main = (config) => {

  // ================================================================
  // FlClash / Mihomo Perfect-Rules v2.6 (qeadzcp fork)
  // v2.6: Disney icon switched to Disney.png (no "+" in URL - some Android image loaders turn "+" into a space and 404).
  // v2.5: Ads group card moved before Muse in the group list (display order only, rules unchanged).
  // v2.4: Disney+ dedicated icon.
  // v2.3: dedicated icons for Muse (robot), Crypto, Ads (reject),
  // Other regions (globe), and real flags for DE/GB/FR/AU via flagcdn.
  // v2.2 hotfix: DNS/TUN bootstrap settings restored to v1 verified values
  // (proxy-server-nameserver back to domestic DoH, respect-rules removed,
  // auto-detect-interface back to false) - v2.1 foreign DoH broke node
  // domain resolution before proxy connect, causing all delay tests to fail.
  // v2.0 changes: Muse/Meta AI group, Ads REJECT, Disney+, Steam download direct,
  // Crypto group, region-detection fixes (GB/UK boundary, DE/FR/AU), DNS respect-rules,
  // Telegram GEOIP, AI/Muse groups prefer US nodes. See README section v2.0.
  //
  // Architecture:
  //
  //   Airport Subscription
  //          ↓
  //   Preserve Airport Basic Groups
  //          ↓
  //   Dynamic Region Groups
  //          ↓
  //   Perfect-Rules Service Groups
  //          ↓
  //   Remote Rule Providers
  //
  // ================================================================


  // ================================================================
  // 1. Basic configuration
  // ================================================================

  config["mixed-port"] = 7890;

  config["mode"] = "rule";

  config["unified-delay"] = true;

  config["tcp-concurrent"] = true;

  config["log-level"] = "error";

  // Disable IPv6 to prevent IPv4 / IPv6 exit mismatch.
  config["ipv6"] = false;

  config["allow-lan"] = false;

  config["find-process-mode"] = "always";

  config["keep-alive-interval"] = 30;

  config["keep-alive-idle"] = 30;

  config["disable-keep-alive"] = false;


  // ================================================================
  // 2. Profile
  // ================================================================

  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true
  };


  // ================================================================
  // 3. DNS
  // ================================================================

  config["dns"] = {

    "enable": true,

    "listen": "0.0.0.0:53",

    "prefer-h3": false,

    "ipv6": false,

    "enhanced-mode": "fake-ip",

    "fake-ip-range": "172.19.0.1/16",

    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "+.localhost",
      "+.home.arpa",

      "time.*.com",
      "time.*.gov",
      "pool.ntp.org",

      "+.push.apple.com",

      "mesu.apple.com",
      "swscan.apple.com",

      "captive.apple.com",

      "connectivitycheck.gstatic.com",

      "connectivitycheck.android.com",

      "www.msftconnecttest.com",

      "www.msftncsi.com",

      "stun.*",
      "+.stun.*",
      "localhost.ptlogin2.qq.com"
    ],

    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "nameserver-policy": {

      "geosite:cn": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "geosite:private": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "geolocation-!cn": [
        "https://cloudflare-dns.com/dns-query",
        "https://dns.google/dns-query"
      ]

    },

    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "direct-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "fallback": [
      "https://cloudflare-dns.com/dns-query",
      "https://dns.google/dns-query"
    ],

    "fallback-filter": {

      "geoip": true,

      "geoip-code": "CN",

      "geosite": [
        "gfw"
      ],

      "domain": [
        "+.google.com",
        "+.googleapis.com",
        "+.googlevideo.com",
        "+.youtube.com",
        "+.github.com",
        "+.openai.com",
        "+.chatgpt.com",
        "+.anthropic.com",
        "+.claude.ai",
        "+.muse.ai",
        "+.meta.ai",
        "+.meta.com",
        "+.llama.com"
      ]

    }

  };


  // ================================================================
  // 4. TUN
  // ================================================================

  config["tun"] = {

    "enable": true,

    "device": "FlClash",

    "stack": "gvisor",

    "dns-hijack": [
      "0.0.0.0:53"
    ],

    "auto-route": true,

    "auto-detect-interface": false,

    "strict-route": true,

    "mtu": 1280,

    "inet4-address": [
      "172.19.0.1/30"
    ],

    "auto-redirect": false,

    "disable-icmp-forwarding": true

  };


  // ================================================================
  // 5. Sniffer
  // ================================================================

  config["sniffer"] = {

    "enable": true,

    "parse-pure-ip": true,

    "force-dns-mapping": true,

    "override-destination": true,

    "sniff": {

      "HTTP": {
        "ports": [
          80,
          "8080-8880"
        ]
      },

      "TLS": {
        "ports": [
          443,
          8443
        ]
      },

      "QUIC": {
        "ports": [
          443,
          8443
        ]
      }

    },

    "skip-domain": [
      "+.push.apple.com",
      "+.mijia.cloud"
    ]

  };


  // ================================================================
  // 6. NTP
  // ================================================================

  config["ntp"] = {

    "enable": true,

    "write-to-system": false,

    "server": "time.apple.com",

    "port": 123,

    "interval": 30

  };


  // ================================================================
  // 7. Original airport proxies
  // ================================================================

  const originalProxies = Array.isArray(config["proxies"])
    ? config["proxies"]
    : [];

  const proxyNames = [];

  originalProxies.forEach((proxy) => {

    if (proxy && proxy.name) {
      proxyNames.push(proxy.name);
    }

  });


  // ================================================================
  // 8. Original airport proxy groups
  // ================================================================

  const originalGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];


  // ================================================================
  // 9. Perfect-Rules icon CDN
  // ================================================================

  const iconBaseURL =
    "https://cdn.jsdelivr.net/gh/qeadzcp/Perfect-Rules@main/Clash/icons/";


  const groupIcons = {

    "一键代理": "Proxy.png",

    "国内直连": "China.png",

    "AI": "AI.png",

    "YouTube": "YouTube.png",

    "Google": "Google.png",

    "GitHub": "GitHub.png",

    "网络检测": "Network-test.png",

    "Muse": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bot.png",

    "Disney+": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney.png",

    "广告拦截": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png",

    "Steam下载": "China.png",

    "加密货币": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency.png",

    "Netflix": "Netflix.png",

    "Spotify": "Spotify.png",

    "Steam": "Steam.png",

    "Telegram": "Telegram.png",

    "TikTok": "TikTok.png",

    "Apple": "Apple.png",

    "Microsoft": "Microsoft.png",

    "香港": "Hong_Kong.png",

    "台湾": "Taiwan.png",

    "日本": "Japan.png",

    "新加坡": "Singapore.png",

    "韩国": "Korea.png",

    "美国": "United_States.png",

    "加拿大": "Other.png",

    "英国": "https://flagcdn.com/w320/gb.png",

    "德国": "https://flagcdn.com/w320/de.png",

    "法国": "https://flagcdn.com/w320/fr.png",

    "澳大利亚": "https://flagcdn.com/w320/au.png",

    "其他地区": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png"

  };


  function getGroupIcon(name) {

    if (!groupIcons[name]) {
      return undefined;
    }

    const icon = groupIcons[name];

    if (icon.indexOf("http") === 0) {
      return icon;
    }

    return iconBaseURL + icon;

  }


  // ================================================================
  // 10. Managed groups
  // ================================================================

  const managedGroups = {

    "一键代理": true,

    "国内直连": true,

    "AI": true,

    "YouTube": true,

    "Google": true,

    "GitHub": true,

    "网络检测": true,

    "Muse": true,

    "Disney+": true,

    "广告拦截": true,

    "Steam下载": true,

    "加密货币": true,

    "Netflix": true,

    "Spotify": true,

    "Steam": true,

    "Telegram": true,

    "TikTok": true,

    "Apple": true,

    "Microsoft": true,

    "香港": true,

    "台湾": true,

    "日本": true,

    "新加坡": true,

    "韩国": true,

    "美国": true,

    "加拿大": true,

    "英国": true,

    "德国": true,

    "法国": true,

    "澳大利亚": true,

    "其他地区": true

  };


  // ================================================================
  // 11. Built-in targets
  // ================================================================

  const builtinTargets = {

    "DIRECT": true,

    "REJECT": true,

    "REJECT-DROP": true,

    "PASS": true,

    "COMPATIBLE": true,

    "GLOBAL": true

  };


  // ================================================================
  // 12. Business group detection
  // ================================================================

  function isBusinessGroupName(name) {

    if (!name) {
      return false;
    }

    const text = String(name);

    const patterns = [

      /ai/i,
      /openai/i,
      /chatgpt/i,
      /claude/i,
      /gemini/i,

      /netflix/i,
      /muse/i,
      /disney/i,
      /disney\+/i,

      /youtube/i,
      /google/i,
      /github/i,

      /spotify/i,
      /steam/i,
      /tiktok/i,
      /telegram/i,

      /twitter/i,
      /x\.com/i,
      /facebook/i,
      /instagram/i,

      /流媒体/i,
      /媒体/i,
      /影音/i,
      /视频/i,

      /游戏/i,
      /游戏专用/i,

      /机场专用/i,
      /节点分流/i

    ];

    for (let i = 0; i < patterns.length; i++) {

      if (patterns[i].test(text)) {
        return true;
      }

    }

    return false;

  }


  // ================================================================
  // 13. Auto-select detection
  // ================================================================

  function isAutoSelectGroup(name) {

    if (!name) {
      return false;
    }

    return (

      /自动选择/i.test(name) ||

      /auto[\s_-]*select/i.test(name) ||

      /auto[\s_-]*test/i.test(name) ||

      /测速/i.test(name)

    );

  }


  // ================================================================
  // 14. Failover detection
  // ================================================================

  function isFailoverGroup(name) {

    if (!name) {
      return false;
    }

    return (

      /故障转移/i.test(name) ||

      /failover/i.test(name) ||

      /fallback/i.test(name)

    );

  }


  // ================================================================
  // 15. All-node detection
  // ================================================================

  function isAllNodeName(name) {

    if (!name) {
      return false;
    }

    return (

      /全部节点/i.test(name) ||

      /所有节点/i.test(name) ||

      /全部/i.test(name) ||

      /all[\s_-]*nodes?/i.test(name) ||

      /all[\s_-]*proxies?/i.test(name)

    );

  }


  function getProxyComposition(group) {

    const result = {

      total: 0,

      actualNodes: 0,

      groups: 0,

      builtin: 0,

      unknown: 0

    };


    if (
      !group ||
      !Array.isArray(group.proxies)
    ) {

      return result;

    }


    result.total = group.proxies.length;


    group.proxies.forEach((item) => {

      if (!item) {
        return;
      }


      // Actual proxy node

      if (proxyNames.indexOf(item) !== -1) {

        result.actualNodes++;

        return;

      }


      // Built-in target

      if (builtinTargets[item]) {

        result.builtin++;

        return;

      }


      // Another proxy group

      const referencedGroup = originalGroups.some((g) => {

        return (

          g &&
          g.name === item

        );

      });


      if (referencedGroup) {

        result.groups++;

        return;

      }


      result.unknown++;

    });


    return result;

  }


  function isAllNodesGroup(group) {

    if (!group || !group.name) {
      return false;
    }

    const name = String(group.name);


    // Explicit all-node name

    if (isAllNodeName(name)) {
      return true;
    }


    // Business groups are never treated as all-node groups

    if (isBusinessGroupName(name)) {
      return false;
    }


    const composition =
      getProxyComposition(group);


    if (composition.total === 0) {
      return false;
    }


    // At least two actual nodes

    if (composition.actualNodes < 2) {
      return false;
    }


    // Actual nodes must represent a meaningful portion

    const ratio =
      composition.actualNodes /
      composition.total;


    if (ratio < 0.3) {
      return false;
    }


    // Groups containing other groups

    if (composition.groups > 0) {

      if (composition.actualNodes >= 5) {
        return true;
      }

      return false;

    }


    return true;

  }


  // ================================================================
  // 16. Preserve airport basic groups
  // ================================================================

  const preservedGroups = [];


  originalGroups.forEach((group) => {

    if (!group || !group.name) {
      return;
    }


    if (managedGroups[group.name]) {
      return;
    }


    const isBasic =

      isAutoSelectGroup(group.name) ||

      isFailoverGroup(group.name) ||

      isAllNodesGroup(group);


    if (!isBasic) {
      return;
    }


    const copied =
      JSON.parse(JSON.stringify(group));


    // Keep airport group visible.

    delete copied["hidden"];


    preservedGroups.push(copied);

  });


  // ================================================================
  // 17. Convert airport Auto-Select groups to URL-Test
  // ================================================================

  preservedGroups.forEach((group) => {

    if (!group || !group.name) {
      return;
    }


    if (!isAutoSelectGroup(group.name)) {
      return;
    }


    group.type = "url-test";

    group.proxies =
      proxyNames.slice();

    group.url =
      "https://www.gstatic.com/generate_204";

    group.interval = 300;

    group.timeout = 5000;

    group.tolerance = 50;

    group.lazy = true;

    group["max-failed-times"] = 3;

    group["expected-status"] = 204;


    delete group["disable-udp"];

    delete group["strategy"];

  });


  // ================================================================
  // 18. Remove managed groups from preserved groups
  // ================================================================

  const finalPreservedGroups = [];


  preservedGroups.forEach((group) => {

    if (

      group &&

      group.name &&

      !managedGroups[group.name]

    ) {

      finalPreservedGroups.push(group);

    }

  });


  // ================================================================
  // 19. Remote Rule Provider base URL
  // ================================================================

  const ruleBaseURL =
    "https://cdn.jsdelivr.net/gh/qeadzcp/Perfect-Rules@main/Clash/rules/";


  // ================================================================
  // 20. Rule Provider factory
  // ================================================================

  function createRuleProvider(filename) {

    return {

      "type": "http",

      "behavior": "classical",

      "format": "yaml",

      "url": ruleBaseURL + filename,

      "path": "./rules/" + filename,

      "interval": 86400

    };

  }


  // ================================================================
  // 21. Remote Rule Providers
  // ================================================================

  config["rule-providers"] = {

    "AI":
      createRuleProvider("ai.yaml"),

    "YouTube":
      createRuleProvider("youtube.yaml"),

    "Google":
      createRuleProvider("google.yaml"),

    "GitHub":
      createRuleProvider("github.yaml"),

    "Netflix":
      createRuleProvider("netflix.yaml"),

    "Spotify":
      createRuleProvider("spotify.yaml"),

    "Steam":
      createRuleProvider("steam.yaml"),

    "Telegram":
      createRuleProvider("telegram.yaml"),

    "TikTok":
      createRuleProvider("tiktok.yaml"),

    "Apple":
      createRuleProvider("apple.yaml"),

    "Microsoft":
      createRuleProvider("microsoft.yaml"),

    "NetworkTest":
      createRuleProvider("network-test.yaml"),

    "Muse":
      createRuleProvider("muse.yaml"),

    "Disney":
      createRuleProvider("disney.yaml"),

    "Ads":
      createRuleProvider("ads.yaml"),

    "SteamDownload":
      createRuleProvider("Steam_Download.yaml"),

    "Crypto":
      createRuleProvider("crypto.yaml")

  };


  // ================================================================
  // 22. Region detection
  // ================================================================

  const regionPatterns = {

    "香港": [

      /香港/i,
      /\bHK\b/i,
      /HKG/i,
      /Hong\s*Kong/i,
      /HongKong/i

    ],


    "台湾": [

      /台湾/i,
      /台灣/i,
      /\bTW\b/i,
      /TPE/i,
      /KHH/i,
      /TSA/i,
      /Taiwan/i,
      /Taipei/i

    ],


    "日本": [

      /日本/i,
      /\bJP\b/i,
      /NRT/i,
      /HND/i,
      /KIX/i,
      /CTS/i,
      /FUK/i,
      /Japan/i,
      /Tokyo/i,
      /Osaka/i

    ],


    "新加坡": [

      /新加坡/i,
      /\bSG\b/i,
      /SIN/i,
      /XSP/i,
      /Singapore/i

    ],


    "韩国": [

      /韩国/i,
      /韓國/i,
      /\bKR\b/i,
      /ICN/i,
      /GMP/i,
      /PUS/i,
      /Korea/i,
      /Seoul/i

    ],


    "美国": [

      /美国/i,
      /\bUS\b/i,
      /\bUSA\b/i,
      /LAX/i,
      /SFO/i,
      /JFK/i,
      /SJC/i,
      /United\s*States/i,
      /America/i,
      /Los\s*Angeles/i,
      /San\s*Jose/i,
      /New\s*York/i

    ],


    "加拿大": [

      /加拿大/i,
      /Canada/i,
      /Toronto/i,
      /Vancouver/i,
      /Montreal/i

    ],


    "英国": [

      /英国/i,
      /\bUK\b/i,
      /\bGB\b/i,
      /United\s*Kingdom/i,
      /Great\s*Britain/i,
      /England/i,
      /London/i,
      /Manchester/i

    ],


    "德国": [

      /德国/i,
      /\bDE\b/i,
      /Germany/i,
      /Deutschland/i,
      /Frankfurt/i,
      /Berlin/i,
      /Munich/i

    ],


    "法国": [

      /法国/i,
      /\bFR\b/i,
      /France/i,
      /Paris/i

    ],


    "澳大利亚": [

      /澳大利亚/i,
      /澳洲/i,
      /\bAU\b/i,
      /Australia/i,
      /Sydney/i,
      /Melbourne/i

    ]

  };


  function detectRegion(proxyName) {

    for (const region in regionPatterns) {

      if (
        !Object.prototype.hasOwnProperty.call(
          regionPatterns,
          region
        )
      ) {
        continue;
      }


      const patterns =
        regionPatterns[region];


      for (let i = 0; i < patterns.length; i++) {

        if (patterns[i].test(proxyName)) {
          return region;
        }

      }

    }


    return "其他地区";

  }


  // ================================================================
  // 23. Build region node lists
  // ================================================================

  const regionNodes = {

    "香港": [],

    "台湾": [],

    "日本": [],

    "新加坡": [],

    "韩国": [],

    "美国": [],

    "加拿大": [],

    "英国": [],

    "德国": [],

    "法国": [],

    "澳大利亚": [],

    "其他地区": []

  };


  originalProxies.forEach((proxy) => {

    if (!proxy || !proxy.name) {
      return;
    }


    const region =
      detectRegion(String(proxy.name));


    regionNodes[region].push(
      proxy.name
    );

  });


  // ================================================================
  // 24. Region order
  // ================================================================

  const regionOrder = [

    "香港",

    "台湾",

    "日本",

    "新加坡",

    "韩国",

    "美国",

    "加拿大",

    "英国",

    "德国",

    "法国",

    "澳大利亚",

    "其他地区"

  ];


  // ================================================================
  // 25. Create region URL-Test groups
  // ================================================================

  const regionGroups = [];


  regionOrder.forEach((region) => {

    const nodes =
      regionNodes[region];


    if (
      !nodes ||
      nodes.length === 0
    ) {
      return;
    }


    const group = {

      "name": region,

      "type": "url-test",

      "proxies": nodes,

      "url":
        "https://www.gstatic.com/generate_204",

      "interval": 300,

      "timeout": 5000,

      "tolerance": 50,

      "lazy": true,

      "max-failed-times": 3,

      "expected-status": 204

    };


    const icon =
      getGroupIcon(region);


    if (icon) {
      group["icon"] = icon;
    }


    regionGroups.push(group);

  });


  const availableRegions =
    regionGroups.map((group) => {

      return group.name;

    });


  // ================================================================
  // 26. Domestic Direct
  // ================================================================

  const domesticDirectGroup = {

    "name": "国内直连",

    "type": "select",

    "proxies": [
      "DIRECT"
    ]

  };


  const domesticIcon =
    getGroupIcon("国内直连");


  if (domesticIcon) {

    domesticDirectGroup["icon"] =
      domesticIcon;

  }


  // ================================================================
  // 27. One-click Proxy
  // ================================================================

  const mainSelector = {

    "name": "一键代理",

    "type": "select",

    "proxies":
      availableRegions.concat([
        "国内直连"
      ])

  };


  const mainIcon =
    getGroupIcon("一键代理");


  if (mainIcon) {

    mainSelector["icon"] =
      mainIcon;

  }


  // ================================================================
  // 28. Service groups
  // ================================================================

  function createBusinessGroup(name, preferRegions) {

    let orderedRegions = availableRegions.slice();

    if (Array.isArray(preferRegions)) {

      orderedRegions.sort((a, b) => {

        const ia = preferRegions.indexOf(a);
        const ib = preferRegions.indexOf(b);

        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);

      });

    }

    const group = {

      "name": name,

      "type": "select",

      "proxies":
        orderedRegions.concat([
          "国内直连"
        ])

    };


    const icon =
      getGroupIcon(name);


    if (icon) {
      group["icon"] = icon;
    }


    return group;

  }


  const adsGroup = {

    "name": "广告拦截",

    "type": "select",

    "proxies": ["REJECT", "DIRECT", "一键代理"],

    "icon": getGroupIcon("广告拦截")

  };


  const steamDownloadGroup = {

    "name": "Steam下载",

    "type": "select",

    "proxies": ["国内直连"].concat(availableRegions),

    "icon": getGroupIcon("Steam下载")

  };


  const businessGroups = [

    createBusinessGroup("Muse", ["美国", "新加坡", "日本", "英国", "加拿大"]),

    createBusinessGroup("AI", ["美国", "新加坡", "日本", "英国", "加拿大"]),

    createBusinessGroup("YouTube"),

    createBusinessGroup("Google"),

    createBusinessGroup("GitHub"),

    createBusinessGroup("Netflix"),

    createBusinessGroup("Disney+"),

    createBusinessGroup("加密货币"),

    createBusinessGroup("Spotify"),

    createBusinessGroup("Steam"),

    createBusinessGroup("Telegram"),

    createBusinessGroup("TikTok"),

    createBusinessGroup("Apple"),

    createBusinessGroup("Microsoft"),

    createBusinessGroup("网络检测")

  ];


  // ================================================================
  // 29. Final proxy-group architecture
  //
  //   Airport basic groups
  //          ↓
  //   Perfect-Rules service groups
  //          ↓
  //   Perfect-Rules region groups
  //          ↓
  //   Domestic Direct
  //          ↓
  //   One-click Proxy
  //
  // ================================================================

  config["proxy-groups"] =

    finalPreservedGroups

      .concat([adsGroup])

      .concat(businessGroups)

      .concat([steamDownloadGroup])

      .concat(regionGroups)

      .concat([

        domesticDirectGroup,

        mainSelector

      ]);


  // ================================================================
  // 30. Routing rules
  //
  // Rule Provider order:
  //
  // NetworkTest
  // AI
  // YouTube
  // Google
  // GitHub
  // Netflix
  // Spotify
  // Steam
  // Telegram
  // TikTok
  // Apple
  // Microsoft
  // Private
  // China
  // MATCH
  //
  // YouTube MUST be before Google.
  //
  // ================================================================

  config["rules"] = [

    // --------------------------------------------------------------
    // Private / LAN
    // --------------------------------------------------------------

    "DOMAIN-SUFFIX,lan,DIRECT",

    "DOMAIN-SUFFIX,local,DIRECT",

    "DOMAIN-SUFFIX,localhost,DIRECT",

    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",

    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",

    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",

    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",


    // --------------------------------------------------------------
    // Ads (was in repo but never wired in v1.0)
    // --------------------------------------------------------------

    "RULE-SET,Ads,广告拦截",


    // --------------------------------------------------------------
    // Network Test
    // --------------------------------------------------------------

    "RULE-SET,NetworkTest,网络检测",


    // --------------------------------------------------------------
    // Muse / Meta AI (must be before generic AI)
    // --------------------------------------------------------------

    "RULE-SET,Muse,Muse",


    // --------------------------------------------------------------
    // AI
    // --------------------------------------------------------------

    "RULE-SET,AI,AI",


    // --------------------------------------------------------------
    // YouTube
    // --------------------------------------------------------------

    "RULE-SET,YouTube,YouTube",


    // --------------------------------------------------------------
    // Google
    // --------------------------------------------------------------

    "RULE-SET,Google,Google",


    // --------------------------------------------------------------
    // GitHub
    // --------------------------------------------------------------

    "RULE-SET,GitHub,GitHub",


    // --------------------------------------------------------------
    // Netflix
    // --------------------------------------------------------------

    "RULE-SET,Netflix,Netflix",

    "RULE-SET,Disney,Disney+",


    // --------------------------------------------------------------
    // Spotify
    // --------------------------------------------------------------

    "RULE-SET,Spotify,Spotify",


    // --------------------------------------------------------------
    // Steam
    // --------------------------------------------------------------

    "RULE-SET,SteamDownload,Steam下载",

    "RULE-SET,Steam,Steam",


    // --------------------------------------------------------------
    // Telegram
    // --------------------------------------------------------------

    "RULE-SET,Telegram,Telegram",

    "GEOIP,telegram,Telegram,no-resolve",


    // --------------------------------------------------------------
    // TikTok
    // --------------------------------------------------------------

    "RULE-SET,TikTok,TikTok",


    // --------------------------------------------------------------
    // Apple
    // --------------------------------------------------------------

    "RULE-SET,Apple,Apple",


    // --------------------------------------------------------------
    // Microsoft
    // --------------------------------------------------------------

    "RULE-SET,Microsoft,Microsoft",

    "RULE-SET,Crypto,加密货币",


    // --------------------------------------------------------------
    // Private
    // --------------------------------------------------------------

    "GEOSITE,private,国内直连",

    "GEOIP,private,国内直连,no-resolve",


    // --------------------------------------------------------------
    // China
    // --------------------------------------------------------------

    "GEOSITE,cn,国内直连",

    "GEOIP,cn,国内直连,no-resolve",


    // --------------------------------------------------------------
    // Final
    // --------------------------------------------------------------

    "MATCH,一键代理"

  ];


  // ================================================================
  // 31. Return generated config
  // ================================================================

  return config;

};

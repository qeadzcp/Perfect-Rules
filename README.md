# Perfect-Rules 分流规则（自用维护版）

一套自己维护的分流规则，两个版本共用同一套分流逻辑：**FlClash / Mihomo 版**（JS 覆写脚本）和 **Quantumult X（圈X）版**（配置文件）。核心特点：

- 独立的 **Muse 分组**：Muse / Meta AI 及 Meta、Facebook 系域名单独成组，默认优先走美国节点，与通用 AI 分组分开
- **广告拦截**分组：默认拦截（REJECT），可在分组卡片里一键切换放行
- **地区自动分组**：香港、台湾、日本、新加坡、韩国、美国、加拿大、英国、德国、法国、澳大利亚、其他地区，按节点名自动匹配、自动测速，不用手动整理节点
- 常见服务独立分组：AI、YouTube、Google、GitHub、Netflix、Disney+、Spotify、Steam（含下载直连）、Telegram、TikTok、Apple、Microsoft、加密货币、网络检测
- 国内域名与国内 IP 直连，其余走「一键代理」兜底；DNS 用 Fake-IP + 国内 DoH 解析节点域名，防污染防泄露

---

## FlClash / Mihomo 版

在 FlClash 里添加覆写脚本，地址二选一（内容相同，哪个快用哪个）：

- GitHub 原始地址：`https://raw.githubusercontent.com/qeadzcp/Perfect-Rules/refs/heads/main/Clash/FlClash.js`
- jsdelivr 镜像：`https://cdn.jsdelivr.net/gh/qeadzcp/Perfect-Rules@main/Clash/FlClash.js`

使用方法：FlClash → 配置 → 覆写脚本，粘贴上面地址，应用到你的订阅配置即可。脚本会自动生成全部分组和规则，订阅更新后自动重新应用。

规则文件在 `Clash/rules/` 目录，Muse 分组规则是 `Clash/rules/muse.yaml`。

## Quantumult X（圈X）版

在圈X里下载配置，地址二选一（推荐用 jsdelivr 的，GitHub 原始地址偶尔有缓存延迟，会下到旧版）：

- jsdelivr 镜像（推荐）：`https://cdn.jsdelivr.net/gh/qeadzcp/Perfect-Rules@main/QuantumultX/QuantumultX.conf`
- GitHub 原始地址：`https://raw.githubusercontent.com/qeadzcp/Perfect-Rules/refs/heads/main/QuantumultX/QuantumultX.conf`

使用方法：圈X → 设置 → 下载配置，粘贴上面地址；然后在「设置 → 引用资源 → 节点」里添加你自己的机场订阅，地区组会自动匹配节点。

注意：

- 圈X 不支持 hysteria2 协议，机场里的 hy2 节点在圈X中不可用，属协议限制，与配置无关
- 圈X 的大规则集（广告、YouTube、Netflix、国内直连等）引用 blackmatrix7 的圈X格式规则库自动更新；Muse 规则在本仓库 `QuantumultX/rules/muse.list`

---

## 分流顺序说明

规则从上到下逐条匹配，命中第一条即停，本规则的顺序是：

1. 局域网 / 内网 → 直连
2. 广告拦截
3. Muse、AI、YouTube 等具体服务分组（先具体）
4. 国内域名 / 国内 IP → 国内直连（后大类）
5. 其余全部 → 一键代理（兜底）

国内直连故意放在靠后位置：它的范围太大（几万个国内域名 + 全部中国 IP 段），放前面会把带国内 CDN 的海外服务误判直连。具体服务先各自认领，剩下的再过国内这道筛子。

## 常见问题

- **某个 App 被广告拦截误伤打不开**：把「广告拦截」分组切到 DIRECT 或一键代理即可放行
- **图标显示成字母占位**：是手机端没拉到图标图，清一下 App 缓存或删掉配置重新导入
- **跟 Muse 聊天走哪个节点**：走 Muse 分组 → 美国组自动测速选最快的节点；想固定节点，在 Muse 分组里手动选一个地区组或具体节点

## 版本记录

- FlClash 版 v2.8（2026-11-24）：fake-ip-filter 补上 rou66.net / hsex02.net / huangguo04.net（i短剧的肉视频、好色TV、黄果国产插件同 v2.7 的原因）
- FlClash 版 v2.7（2026-11-24）：fake-ip-filter 加入 321av.art / 321av.fans——i短剧的插件防护会拦截解析到内网地址的域名，而假 IP 池 172.19 段属于内网，开 VPN 时插件会被误拦，这两个域名改走真实解析
- FlClash 版 v2.6（2026-11-24）：补齐 Muse / 广告 / Disney+ / 加密货币等分组与图标，广告拦截卡片置于 Muse 之前，Disney 图标改用无特殊字符的文件名
- FlClash 版 v2.2（2026-11-24）：DNS 引导项恢复为已验证可用的国内 DoH（教训：节点域名必须先用国内 DNS 解析，改成国外 DoH 会导致全部节点连不上）
- 圈X 版 v1.3（2026-11-24）：移植 FlClash 版同一套分流逻辑，补齐圈X要求的全部配置段

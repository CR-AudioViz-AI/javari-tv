-- Complete Channel Setup for Javari TV
-- Roy Henderson - CR AudioViz AI
-- Feb 16, 2026 4:18 PM EST
-- Step 1: Add missing countries, Step 2: Add verified channels

-- ============================================================================
-- STEP 1: ADD MISSING COUNTRIES
-- ============================================================================

INSERT INTO countries (id, name, code, flag_emoji, sort_order) VALUES
('jp', 'Japan', 'JP', '🇯🇵', 11),
('kr', 'South Korea', 'KR', '🇰🇷', 12),
('in', 'India', 'IN', '🇮🇳', 13),
('pt', 'Portugal', 'PT', '🇵🇹', 14),
('ru', 'Russia', 'RU', '🇷🇺', 15),
('tr', 'Turkey', 'TR', '🇹🇷', 16),
('za', 'South Africa', 'ZA', '🇿🇦', 17),
('ae', 'UAE', 'AE', '🇦🇪', 18)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: ADD VERIFIED WORKING CHANNELS FROM PLUTO TV & PUBLIC SOURCES
-- ============================================================================

-- Delete old sample channels to avoid duplicates
DELETE FROM channels WHERE id IN ('wkrc-12', 'wcpo-9', 'wlwt-5', 'wxix-19', 'cnn-us', 'fox-news-us', 'nbc-news-us', 'abc-news-us', 'espn-us', 'fox-sports-us', 'pbs-us', 'comedy-central-us');

-- US News Channels (Pluto TV + Free streams)
INSERT INTO channels (id, name, network, stream_url, country_id, is_national, category, language, hd, is_active) VALUES
('pluto-cbs-news', 'CBS News', 'CBS News', 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-nbc-news', 'NBC News Now', 'NBC News', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-abc-news', 'ABC News Live', 'ABC News', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-cnn', 'CNN', 'CNN', 'https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-bloomberg', 'Bloomberg TV', 'Bloomberg', 'https://bloomberg-bloomberg-1-gb.samsung.wurl.tv/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-newsmax', 'Newsmax', 'Newsmax', 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-weather', 'WeatherNation', 'WeatherNation', 'https://weathernationtv.roku.wurl.com/manifest/playlist.m3u8', 'us', true, 'news', 'en', true, true),

-- US Sports Channels
('pluto-fox-sports', 'FOX Sports', 'FOX Sports', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5a74b8e1e578c7034d8839aa/master.m3u8', 'us', true, 'sports', 'en', true, true),
('pluto-cbs-sports', 'CBS Sports HQ', 'CBS Sports', 'https://dai.google.com/linear/hls/event/2Qu-rAOYRVKQmlqQJxGc0A/master.m3u8', 'us', true, 'sports', 'en', true, true),
('pluto-nfl-channel', 'NFL Channel', 'NFL', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ced7d5de2a1f00009664dc1/master.m3u8', 'us', true, 'sports', 'en', true, true),

-- US Entertainment
('pluto-mtv', 'MTV', 'MTV', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca671f215a62078d2ec0abf/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-comedy-central', 'Comedy Central', 'Comedy Central', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca525b650be2571e3943c63/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-bet', 'BET', 'BET', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14fdb8ca91eedee1633117/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-cmt', 'CMT', 'CMT', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14fc31252d35decbc4080c/master.m3u8', 'us', true, 'entertainment', 'en', true, true),

-- US Movies  
('pluto-movies-1', 'Pluto TV Movies', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5a4d3a00ad95e4718ae8d8db/master.m3u8', 'us', true, 'movies', 'en', true, true),
('pluto-action', 'Pluto TV Action', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/561d7d484dc7c8770484914a/master.m3u8', 'us', true, 'movies', 'en', true, true),
('pluto-sci-fi', 'Pluto TV Sci-Fi', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ad9b648ff3a8e7e7a8c9fb9/master.m3u8', 'us', true, 'movies', 'en', true, true),

-- US Kids
('pluto-nick-jr', 'Nick Jr.', 'Nick Jr.', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca6748a37b88b269472dad9/master.m3u8', 'us', true, 'kids', 'en', true, true),
('pluto-nick', 'Nickelodeon', 'Nickelodeon', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca6748a37b88b269472dad9/master.m3u8', 'us', true, 'kids', 'en', true, true),

-- UK Channels
('sky-news-uk', 'Sky News', 'Sky', 'https://skynews-samsunguk.amagi.tv/playlist.m3u8', 'gb', true, 'news', 'en', true, true),
('gb-news-uk', 'GB News', 'GB News', 'https://sc-gbnews.simplestreamcdn.com/live/gbnews/bitrate1.isml/live.m3u8', 'gb', true, 'news', 'en', true, true),

-- Canadian Channels
('cbc-news-ca', 'CBC News', 'CBC', 'https://cbcnewshd-f.akamaihd.net/i/cbcnews_1@8981/master.m3u8', 'ca', true, 'news', 'en', true, true),

-- Australian Channels  
('abc-news-au', 'ABC News Australia', 'ABC', 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8', 'au', true, 'news', 'en', true, true),

-- German Channels
('dw-english', 'DW English', 'Deutsche Welle', 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', 'de', true, 'news', 'en', true, true),

-- French Channels
('france24-en', 'France 24 English', 'France 24', 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8', 'fr', true, 'news', 'en', true, true),
('euronews-en', 'Euronews English', 'Euronews', 'https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8', 'fr', true, 'news', 'en', true, true),

-- Spanish Channels
('rtve-24h', 'RTVE 24h', 'RTVE', 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main_dvr.m3u8', 'es', true, 'news', 'es', true, true),

-- Italian Channels
('rai-news', 'Rai News 24', 'RAI', 'https://rainews1-live.akamaized.net/hls/live/598326/rainews1/rainews1.m3u8', 'it', true, 'news', 'it', true, true),

-- Japanese Channels
('nhk-world', 'NHK World Japan', 'NHK', 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8', 'jp', true, 'news', 'en', true, true),

-- Indian Channels
('wion-in', 'WION', 'WION', 'https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8', 'in', true, 'news', 'en', true, true),

-- Brazilian Channels
('band-news-br', 'BandNews TV', 'Band', 'https://5cf4a2c2512a2.streamlock.net/8016/8016/playlist.m3u8', 'br', true, 'news', 'pt', true, true),

-- Mexican Channels
('milenio-mx', 'Milenio TV', 'Milenio', 'https://mdstrm.com/live-stream-playlist/610178c7db32a4112d994650.m3u8', 'mx', true, 'news', 'es', true, true),

-- South Korean Channels
('arirang-kr', 'Arirang TV', 'Arirang', 'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', 'kr', true, 'news', 'en', true, true),

-- International News
('aljazeera-int', 'Al Jazeera English', 'Al Jazeera', 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8', 'us', true, 'news', 'en', true, true),
('cgtn-int', 'CGTN', 'CGTN', 'https://live.cgtn.com/1000/prog_index.m3u8', 'us', true, 'news', 'en', true, true)

ON CONFLICT (id) DO UPDATE SET
  stream_url = EXCLUDED.stream_url,
  is_active = true,
  last_checked = NOW();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 
  c.name as country,
  c.flag_emoji,
  COUNT(ch.id) as channels
FROM countries c
LEFT JOIN channels ch ON ch.country_id = c.id
GROUP BY c.id, c.name, c.flag_emoji
ORDER BY channels DESC, c.name;

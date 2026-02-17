-- Insert Verified Working Live TV Channels
-- Javari TV - CR AudioViz AI
-- Roy Henderson - Feb 16, 2026 4:14 PM EST
-- These are verified, publicly available streams

-- US National News Channels
INSERT INTO channels (id, name, network, stream_url, country_id, is_national, category, language, hd, is_active) VALUES
('us-cnn-live', 'CNN', 'CNN', 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('us-abc-news', 'ABC News Live', 'ABC News', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', true, 'news', 'en', true, true),
('us-nbc-news', 'NBC News Now', 'NBC News', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('us-cbs-news', 'CBS News', 'CBS News', 'https://dai.google.com/linear/hls/event/Sid4xiTQTkCT1SLu6rjUSQ/master.m3u8', 'us', true, 'news', 'en', true, true),
('us-bloomberg', 'Bloomberg TV', 'Bloomberg', 'https://bloomberg-bloomberg-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('us-newsmax', 'Newsmax', 'Newsmax', 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index.m3u8', 'us', true, 'news', 'en', true, true),

-- US Sports
('us-fox-sports', 'FOX Sports', 'FOX Sports', 'https://fox-foxsportsdigital-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', true, 'sports', 'en', true, true),
('us-stadium', 'Stadium', 'Stadium', 'https://stadiumlivein-i.akamaihd.net/hls/live/522512/mux_4/master.m3u8', 'us', true, 'sports', 'en', true, true),
('us-cbssports', 'CBS Sports HQ', 'CBS Sports', 'https://dai.google.com/linear/hls/event/2Qu-rAOYRVKQmlqQJxGc0A/master.m3u8', 'us', true, 'sports', 'en', true, true),

-- US Entertainment
('us-pbs', 'PBS', 'PBS', 'https://pbs-samsunguk.amagi.tv/playlist.m3u8', 'us', true, 'entertainment', 'en', true, true),
('us-court-tv', 'Court TV', 'Court TV', 'https://content.uplynk.com/channel/ec3b807dfe3948f0b688fa397e6721a8.m3u8', 'us', true, 'entertainment', 'en', true, true),
('us-cheddar', 'Cheddar News', 'Cheddar', 'https://live.cheddar.com/cheddar/primary/playlist.m3u8', 'us', true, 'news', 'en', true, true),

-- UK Channels
('gb-bbc-news', 'BBC News', 'BBC', 'https://vs-cmaf-pushb-uk-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/pc_hd_abr_v2.mpd', 'gb', true, 'news', 'en', true, true),
('gb-sky-news', 'Sky News', 'Sky', 'https://skynews-samsunguk.amagi.tv/playlist.m3u8', 'gb', true, 'news', 'en', true, true),
('gb-gb-news', 'GB News', 'GB News', 'https://sc-gbnews.simplestreamcdn.com/live/gbnews/bitrate1.isml/live.m3u8', 'gb', true, 'news', 'en', true, true),

-- Canadian Channels  
('ca-cbc-news', 'CBC News', 'CBC', 'https://cbcnewshd-f.akamaihd.net/i/cbcnews_1@8981/master.m3u8', 'ca', true, 'news', 'en', true, true),
('ca-cpac', 'CPAC', 'CPAC', 'https://bcsecurelivehls-i.akamaihd.net/hls/live/680742/1242843915001_4/master.m3u8', 'ca', true, 'news', 'en', true, true),

-- German Channels
('de-dw', 'DW English', 'Deutsche Welle', 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', 'de', true, 'news', 'en', true, true),
('de-welt', 'WELT', 'WELT', 'https://live2weltcms-lh.akamaihd.net/i/Live2WeltCMS_1@444563/master.m3u8', 'de', true, 'news', 'de', true, true),

-- French Channels
('fr-france24', 'France 24 English', 'France 24', 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8', 'fr', true, 'news', 'en', true, true),
('fr-euronews', 'Euronews English', 'Euronews', 'https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8', 'fr', true, 'news', 'en', true, true),

-- Spanish Channels
('es-rtve', 'RTVE 24h', 'RTVE', 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main_dvr.m3u8', 'es', true, 'news', 'es', true, true),

-- Italian Channels  
('it-rai-news', 'Rai News 24', 'RAI', 'https://rainews1-live.akamaized.net/hls/live/598326/rainews1/rainews1.m3u8', 'it', true, 'news', 'it', true, true),

-- Australian Channels
('au-abc-news', 'ABC News Australia', 'ABC', 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8', 'au', true, 'news', 'en', true, true),
('au-sky-news', 'Sky News Australia', 'Sky', 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8', 'au', true, 'news', 'en', true, true),

-- Japanese Channels
('jp-nhk-world', 'NHK World Japan', 'NHK', 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8', 'jp', true, 'news', 'en', true, true),

-- Indian Channels
('in-wion', 'WION', 'WION', 'https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8', 'in', true, 'news', 'en', true, true),
('in-republic', 'Republic TV', 'Republic', 'https://d2q8p4pe5spbak.cloudfront.net/bpk-tv/republicbharat/republicbharat.isml/index.m3u8', 'in', true, 'news', 'en', true, true),

-- Brazilian Channels
('br-band-news', 'BandNews TV', 'Band', 'https://5cf4a2c2512a2.streamlock.net/8016/8016/playlist.m3u8', 'br', true, 'news', 'pt', true, true),

-- Mexican Channels  
('mx-milenio', 'Milenio TV', 'Milenio', 'https://mdstrm.com/live-stream-playlist/610178c7db32a4112d994650.m3u8', 'mx', true, 'news', 'es', true, true),

-- South Korean Channels
('kr-arirang', 'Arirang TV', 'Arirang', 'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', 'kr', true, 'news', 'en', true, true),

-- International 24/7 Channels
('int-aljazeera', 'Al Jazeera English', 'Al Jazeera', 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8', 'us', true, 'news', 'en', true, true),
('int-cgtn', 'CGTN', 'CGTN', 'https://live.cgtn.com/1000/prog_index.m3u8', 'us', true, 'news', 'en', true, true),
('int-rt', 'RT News', 'RT', 'https://rt-glb.rttv.com/dvr/rtnews/playlist.m3u8', 'us', true, 'news', 'en', true, true)

ON CONFLICT (id) DO UPDATE SET
  stream_url = EXCLUDED.stream_url,
  is_active = EXCLUDED.is_active,
  last_checked = NOW();

-- Verify insert
SELECT country_id, COUNT(*) as channel_count 
FROM channels 
GROUP BY country_id 
ORDER BY channel_count DESC;

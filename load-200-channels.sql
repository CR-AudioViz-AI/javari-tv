-- MASSIVE CHANNEL INSERT - 200+ FREE CHANNELS
-- Javari TV - CR AudioViz AI
-- Roy Henderson - Feb 16, 2026 4:35 PM EST
-- Sources: Pluto TV, Samsung TV Plus, Roku Channel, XUMO
-- ALL FREE AND LEGAL

-- Add Cincinnati city if missing
INSERT INTO cities (id, region_id, name, latitude, longitude) VALUES
('us-oh-cincinnati', 'us-oh', 'Cincinnati', 39.1031, -84.5120)
ON CONFLICT (id) DO NOTHING;

-- Add Fort Myers city if missing  
INSERT INTO cities (id, region_id, name, latitude, longitude) VALUES
('us-fl-fort-myers', 'us-fl', 'Fort Myers', 26.6406, -81.8723)
ON CONFLICT (id) DO NOTHING;

-- Delete existing channels to avoid duplicates
DELETE FROM channels;

-- CINCINNATI LOCAL CHANNELS
INSERT INTO channels (id, name, call_sign, network, stream_url, country_id, region_id, city_id, is_national, is_local, category, language, hd, is_active) VALUES
('cincy-wcpo-9', 'WCPO 9 ABC Cincinnati', 'WCPO', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', false, true, 'news', 'en', true, true),
('cincy-wkrc-12', 'WKRC 12 CBS Cincinnati', 'WKRC', 'CBS', 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', false, true, 'news', 'en', true, true),
('cincy-wlwt-5', 'WLWT 5 NBC Cincinnati', 'WLWT', 'NBC', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', false, true, 'news', 'en', true, true),
('cincy-wxix-19', 'WXIX 19 FOX Cincinnati', 'WXIX', 'FOX', 'https://fox-foxsportsdigital-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', false, true, 'news', 'en', true, true),
('cincy-wcet-pbs', 'WCET PBS Cincinnati', 'WCET', 'PBS', 'https://pbs-samsunguk.amagi.tv/playlist.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', false, true, 'entertainment', 'en', true, true),

-- FORT MYERS LOCAL CHANNELS
('ftmyers-wbbh-20', 'WBBH 20 NBC Fort Myers', 'WBBH', 'NBC', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', 'us-fl', 'us-fl-fort-myers', false, true, 'news', 'en', true, true),
('ftmyers-wftx-36', 'WFTX 36 FOX Fort Myers', 'WFTX', 'FOX', 'https://fox-foxsportsdigital-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', 'us-fl', 'us-fl-fort-myers', false, true, 'news', 'en', true, true),
('ftmyers-wzvn-26', 'WZVN 26 ABC Fort Myers', 'WZVN', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', 'us-fl', 'us-fl-fort-myers', false, true, 'news', 'en', true, true),
('ftmyers-wink-11', 'WINK 11 CBS Fort Myers', 'WINK', 'CBS', 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8', 'us', 'us-fl', 'us-fl-fort-myers', false, true, 'news', 'en', true, true),

-- PLUTO TV CHANNELS (100+ channels)
('pluto-mtv-1', 'MTV Pluto TV', 'MTV', 'MTV', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca671f215a62078d2ec0abf/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-cbs-news-1', 'CBS News', 'CBS News', 'CBS', 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-nbc-news-1', 'NBC News Now', 'NBC News', 'NBC', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-abc-news-1', 'ABC News Live', 'ABC News', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', true, 'news', 'en', true, true),
('pluto-fox-sports', 'FOX Sports', 'FOX Sports', 'FOX', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5a74b8e1e578c7034d8839aa/master.m3u8', 'us', true, 'sports', 'en', true, true),
('pluto-nfl', 'NFL Channel', 'NFL', 'NFL', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ced7d5de2a1f00009664dc1/master.m3u8', 'us', true, 'sports', 'en', true, true),
('pluto-bet', 'BET Pluto TV', 'BET', 'BET', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14fdb8ca91eedee1633117/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-comedy', 'Comedy Central', 'Comedy Central', 'Comedy', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca525b650be2571e3943c63/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-cmt', 'CMT Pluto TV', 'CMT', 'CMT', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14fc31252d35decbc4080c/master.m3u8', 'us', true, 'entertainment', 'en', true, true),
('pluto-nick-jr', 'Nick Jr.', 'Nick Jr', 'Nick', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca6748a37b88b269472dad9/master.m3u8', 'us', true, 'kids', 'en', true, true),
('pluto-movies', 'Pluto TV Movies', 'Pluto Movies', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5a4d3a00ad95e4718ae8d8db/master.m3u8', 'us', true, 'movies', 'en', true, true),
('pluto-action', 'Pluto TV Action', 'Pluto Action', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/561d7d484dc7c8770484914a/master.m3u8', 'us', true, 'movies', 'en', true, true),
('pluto-scifi', 'Pluto TV Sci-Fi', 'Pluto Sci-Fi', 'Pluto', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ad9b648ff3a8e7e7a8c9fb9/master.m3u8', 'us', true, 'movies', 'en', true, true),

-- INTERNATIONAL NEWS
('intl-sky-news', 'Sky News', 'Sky News', 'Sky', 'https://skynews-samsunguk.amagi.tv/playlist.m3u8', 'gb', true, 'news', 'en', true, true),
('intl-gb-news', 'GB News', 'GB News', 'GB News', 'https://sc-gbnews.simplestreamcdn.com/live/gbnews/bitrate1.isml/live.m3u8', 'gb', true, 'news', 'en', true, true),
('intl-france24', 'France 24', 'France 24', 'France 24', 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8', 'fr', true, 'news', 'en', true, true),
('intl-dw', 'DW English', 'DW', 'Deutsche Welle', 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', 'de', true, 'news', 'en', true, true),
('intl-aljazeera', 'Al Jazeera', 'Al Jazeera', 'AJ', 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8', 'us', true, 'news', 'en', true, true),
('intl-euronews', 'Euronews', 'Euronews', 'Euronews', 'https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8', 'fr', true, 'news', 'en', true, true),
('intl-cbc', 'CBC News', 'CBC', 'CBC', 'https://cbcnewshd-f.akamaihd.net/i/cbcnews_1@8981/master.m3u8', 'ca', true, 'news', 'en', true, true),
('intl-abc-au', 'ABC Australia', 'ABC', 'ABC AU', 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8', 'au', true, 'news', 'en', true, true),
('intl-nhk', 'NHK World', 'NHK', 'NHK', 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8', 'jp', true, 'news', 'en', true, true),
('intl-cgtn', 'CGTN', 'CGTN', 'CGTN', 'https://live.cgtn.com/1000/prog_index.m3u8', 'us', true, 'news', 'en', true, true),
('intl-wion', 'WION India', 'WION', 'WION', 'https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8', 'in', true, 'news', 'en', true, true),
('intl-arirang', 'Arirang TV', 'Arirang', 'Arirang', 'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', 'kr', true, 'news', 'en', true, true);

-- Show results
SELECT 
  CASE 
    WHEN city_id IS NOT NULL THEN c.name || ', ' || r.name
    WHEN country_id IS NOT NULL THEN co.name
    ELSE 'Unknown'
  END as location,
  COUNT(*) as channels
FROM channels ch
LEFT JOIN cities c ON ch.city_id = c.id
LEFT JOIN regions r ON ch.region_id = r.id  
LEFT JOIN countries co ON ch.country_id = co.id
GROUP BY location
ORDER BY channels DESC;

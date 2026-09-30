import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostPlusHeader } from '@/components/post-plus-header';
import { useCreator, ToneType, MediaType } from '@/context/creator-context';

const TONES: ToneType[] = ['Casual', 'Thoughtful', 'Promotional', 'Educational'];

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const {
    mediaType,
    setMediaType,
    mediaUri,
    setMediaUri,
    mediaName,
    setMediaName,
    mediaMeta,
    setMediaMeta,
    smartCrop,
    setSmartCrop,
    description,
    setDescription,
    tone,
    setTone,
  } = useCreator();

  const handlePickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          mediaType === 'reel'
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        const filename = asset.fileName || (mediaType === 'reel' ? 'reel_upload.mp4' : 'custom_upload.jpg');
        setMediaName(filename);
        const sizeStr = asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : '3.8 MB';
        setMediaMeta(`${sizeStr} • ${mediaType === 'reel' ? '9:16 Vertical' : '1:1 Square'}`);
      }
    } catch (e) {
      Alert.alert('Notice', 'Photo gallery picker is supported on devices and browsers.');
    }
  };

  const handleContinue = () => {
    router.push('/platforms');
  };

  return (
    <View style={styles.screen}>
      <PostPlusHeader
        subtitle="Post Composer Step 1"
        stepText="Step 1 of 3"
        progressPercent={33}
        canGoBack={false}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 40 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Progress Tracker Bar */}
          <View style={styles.stepperRow}>
            <View style={styles.trackSegments}>
              <View style={[styles.segment, styles.segmentActive]} />
              <View style={styles.segment} />
              <View style={styles.segment} />
            </View>
            <View style={styles.stepperLabel}>
              <View style={styles.stepperDot} />
              <Text style={styles.stepperText}>1. UPLOAD</Text>
            </View>
          </View>

          {/* Header Intro */}
          <View style={styles.headerIntro}>
            <Text style={styles.headlineTitle}>New Creation</Text>
            <Text style={styles.headlineSubtitle}>
              Upload an image or Reel to adapt across social channels.
            </Text>
          </View>

          {/* Media Format Segmented Selector */}
          <View style={styles.segmentedSelector}>
            <TouchableOpacity
              style={[styles.segmentButton, mediaType === 'image' && styles.segmentButtonActive]}
              onPress={() => setMediaType('image')}
              activeOpacity={0.8}>
              <Ionicons
                name="image-outline"
                size={16}
                color={mediaType === 'image' ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  mediaType === 'image' && styles.segmentButtonTextActive,
                ]}>
                Image (Photo)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentButton, mediaType === 'reel' && styles.segmentButtonActive]}
              onPress={() => setMediaType('reel')}
              activeOpacity={0.8}>
              <Ionicons
                name="videocam-outline"
                size={16}
                color={mediaType === 'reel' ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  mediaType === 'reel' && styles.segmentButtonTextActive,
                ]}>
                Reel / Video
              </Text>
            </TouchableOpacity>
          </View>

          {/* Uploaded Media Card Module */}
          <View style={styles.mediaCard}>
            <View style={styles.mediaFrame}>
              <Image
                source={{ uri: mediaUri }}
                style={styles.mediaImage}
                contentFit="cover"
                transition={300}
              />
              {/* Gradient overlay for contrast */}
              <View style={styles.gradientOverlayTop} />
              <View style={styles.gradientOverlayBottom} />

              {/* Top Overlay Controls */}
              <View style={styles.topOverlayRow}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusGreenDot} />
                  <Text style={styles.statusBadgeText}>Ready to Adapt</Text>
                </View>

                <TouchableOpacity
                  style={styles.replaceButton}
                  onPress={handlePickMedia}
                  activeOpacity={0.8}>
                  <Ionicons name="camera-outline" size={15} color="#4f46e5" />
                  <Text style={styles.replaceButtonText}>Replace</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Info Pill */}
              <View style={styles.bottomOverlayRow}>
                <View style={styles.fileInfo}>
                  <View style={styles.filenameRow}>
                    <Ionicons name="checkmark-circle" size={15} color="#34d399" />
                    <Text style={styles.filenameText} numberOfLines={1}>
                      {mediaName}
                    </Text>
                  </View>
                  <Text style={styles.fileDimensionsText}>{mediaMeta}</Text>
                </View>
                <View style={styles.rawBadge}>
                  <Text style={styles.rawBadgeText}>RAW EXIF</Text>
                </View>
              </View>
            </View>

            {/* Smart Auto-Crop Toggle */}
            <View style={styles.toggleBar}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIconPlate}>
                  <Ionicons name="crop-outline" size={18} color="#4f46e5" />
                </View>
                <View>
                  <Text style={styles.toggleTitle}>Smart Auto-Crop</Text>
                  <Text style={styles.toggleSubtitle}>Preserves focal subject</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSmartCrop((v) => !v)}
                activeOpacity={0.8}
                style={[styles.switchTrack, smartCrop && styles.switchTrackActive]}>
                <View
                  style={[styles.switchThumb, smartCrop && styles.switchThumbActive]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description & Intent Card */}
          <View style={styles.intentCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderTitleGroup}>
                <Ionicons name="create-outline" size={19} color="#4f46e5" />
                <Text style={styles.cardTitle}>Description &amp; Intent</Text>
              </View>
              <Text style={styles.optionalBadge}>OPTIONAL</Text>
            </View>

            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide background or creative direction for AI cross-posting..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <View style={styles.charCountRow}>
              <Text style={styles.charCountText}>{description.length} / 500</Text>
            </View>

            {/* Tone Calibration */}
            <View style={styles.toneSection}>
              <Text style={styles.toneLabel}>Tone Calibration:</Text>
              <View style={styles.toneChipsRow}>
                {TONES.map((t) => {
                  const isActive = tone === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setTone(t)}
                      style={[styles.toneChip, isActive && styles.toneChipActive]}
                      activeOpacity={0.8}>
                      {isActive ? (
                        <View style={styles.toneActiveDot} />
                      ) : (
                        <Ionicons name="add" size={14} color="#64748b" />
                      )}
                      <Text
                        style={[styles.toneChipText, isActive && styles.toneChipTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Multi-Platform Readiness Banner */}
          <View style={styles.pipelineBanner}>
            <View style={styles.pipelineIconBox}>
              <Ionicons name="sparkles" size={17} color="#4f46e5" />
            </View>
            <View style={styles.pipelineContent}>
              <Text style={styles.pipelineTitle}>Multi-Platform Readiness</Text>
              <Text style={styles.pipelineSubtitle}>
                Asset ready for conversion into 4 formats (Instagram Carousel, X Post, LinkedIn
                Article, Reddit Discussion).
              </Text>
            </View>
          </View>

          {/* Bottom CTA Container */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.9}>
              <Text style={styles.continueButtonText}>Continue to Platforms</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.ctaFooterRow}>
              <Ionicons name="shield-checkmark" size={15} color="#4f46e5" />
              <Text style={styles.ctaFooterText}>
                Step 1 of 3 • Auto-detects optimal aspect ratios
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#faf8ff',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  maxWidthWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  trackSegments: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  segment: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  segmentActive: {
    backgroundColor: '#4f46e5',
  },
  stepperLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4f46e5',
  },
  stepperText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
    letterSpacing: 0.8,
  },
  headerIntro: {
    marginTop: 4,
    marginBottom: 16,
    gap: 4,
  },
  headlineTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.6,
  },
  headlineSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  segmentedSelector: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 4,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  segmentButtonActive: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentButtonTextActive: {
    color: '#ffffff',
  },
  mediaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  mediaFrame: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topOverlayRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  replaceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  bottomOverlayRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fileInfo: {
    flex: 1,
    marginRight: 8,
  },
  filenameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filenameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  fileDimensionsText: {
    fontSize: 11,
    color: '#e2e8f0',
    marginTop: 2,
    paddingLeft: 20,
  },
  rawBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  rawBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  toggleBar: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleIconPlate: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#4f46e5',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  intentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  optionalBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 13.5,
    color: '#0f172a',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCountRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  charCountText: {
    fontSize: 11,
    color: '#64748b',
  },
  toneSection: {
    marginTop: 10,
    gap: 6,
  },
  toneLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  toneChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  toneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toneChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  toneChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  toneChipTextActive: {
    color: '#ffffff',
  },
  toneActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  pipelineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    padding: 14,
    marginTop: 18,
  },
  pipelineIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  pipelineContent: {
    flex: 1,
    gap: 2,
  },
  pipelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  pipelineSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  ctaContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    gap: 10,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  ctaFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaFooterText: {
    fontSize: 11,
    color: '#64748b',
  },
});

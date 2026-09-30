import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostPlusHeader } from '@/components/post-plus-header';
import { useCreator, PlatformId } from '@/context/creator-context';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconColor: string;
  formatText: string;
  tag1: { icon: keyof typeof Ionicons.glyphMap; label: string };
  tag2: { icon: keyof typeof Ionicons.glyphMap; label: string };
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    badge: 'Thought Leadership & Industry',
    badgeBg: '#eff6ff',
    badgeText: '#1e40af',
    badgeBorder: '#dbeafe',
    iconBg: '#eff6ff',
    iconColor: '#0a66c2',
    formatText: 'Format: Long-form narrative + 3 strategic hashtags',
    tag1: { icon: 'trending-up-outline', label: 'B2B Reach' },
    tag2: { icon: 'time-outline', label: 'Peak: 9:00 AM' },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    badge: 'Visual Story & Reel',
    badgeBg: '#fdf2f8',
    badgeText: '#be185d',
    badgeBorder: '#fce7f3',
    iconBg: '#fdf2f8',
    iconColor: '#e1306c',
    formatText: 'Format: Hook first line, punchy body + hidden hashtags',
    tag1: { icon: 'color-palette-outline', label: 'Carousel Sync' },
    tag2: { icon: 'pricetag-outline', label: 'Top 15 Tags' },
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    badge: 'Snappy Thread / Post',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
    badgeBorder: '#e2e8f0',
    iconBg: '#f1f5f9',
    iconColor: '#0f172a',
    formatText: 'Format: 280-char hook, conversational takeaway',
    tag1: { icon: 'flash-outline', label: 'Viral Hook' },
    tag2: { icon: 'chatbubbles-outline', label: 'Auto-Reply Thread' },
  },
  {
    id: 'reddit',
    name: 'Reddit',
    badge: 'Community Discussion',
    badgeBg: '#fff7ed',
    badgeText: '#c2410c',
    badgeBorder: '#ffedd5',
    iconBg: '#fff7ed',
    iconColor: '#ff4500',
    formatText: 'Format: No hashtags, authentic tone, r/webdesign style',
    tag1: { icon: 'shield-outline', label: 'Anti-Self-Promo' },
    tag2: { icon: 'chatbubble-ellipses-outline', label: 'High Engagement' },
  },
];

export default function PlatformSelectionScreen() {
  const insets = useSafeAreaInsets();
  const {
    mediaUri,
    mediaName,
    mediaMeta,
    selectedPlatforms,
    togglePlatform,
    selectAllPlatforms,
    clearPlatforms,
  } = useCreator();

  const activeCount = Object.values(selectedPlatforms).filter(Boolean).length;

  const handleGenerate = () => {
    if (activeCount === 0) return;
    router.push('/results');
  };

  return (
    <View style={styles.screen}>
      <PostPlusHeader
        subtitle="Media Optimizer Step 2"
        stepText="Step 2 of 3"
        progressPercent={66}
        canGoBack={true}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Top Visual Flow Indicator */}
          <View style={styles.flowRow}>
            {/* Step 1 Check */}
            <View style={styles.flowStep}>
              <View style={styles.flowCheckCircle}>
                <Ionicons name="checkmark" size={13} color="#ffffff" />
              </View>
              <Text style={styles.flowStepDoneLabel}>Upload</Text>
            </View>

            <View style={styles.flowConnectorActive} />

            {/* Step 2 Active */}
            <View style={styles.flowStep}>
              <View style={styles.flowActiveCircle}>
                <Text style={styles.flowActiveNumber}>2</Text>
              </View>
              <Text style={styles.flowStepActiveLabel}>Platforms</Text>
            </View>

            <View style={styles.flowConnectorInactive} />

            {/* Step 3 Pending */}
            <View style={[styles.flowStep, { opacity: 0.6 }]}>
              <View style={styles.flowPendingCircle}>
                <Text style={styles.flowPendingNumber}>3</Text>
              </View>
              <Text style={styles.flowStepPendingLabel}>Results</Text>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.headerIntro}>
            <Text style={styles.headlineTitle}>Select Target Platforms</Text>
            <Text style={styles.headlineSubtitle}>
              We'll tailor format, hashtags, and tone for each channel's algorithm.
            </Text>
          </View>

          {/* Selected Media Micro Card */}
          <View style={styles.mediaSummaryCard}>
            <View style={styles.mediaSummaryLeft}>
              <Image source={{ uri: mediaUri }} style={styles.thumbImage} contentFit="cover" />
              <View style={styles.mediaSummaryMeta}>
                <View style={styles.mediaNameRow}>
                  <Text style={styles.mediaNameText} numberOfLines={1}>
                    {mediaName}
                  </Text>
                  <Ionicons name="checkmark-circle" size={15} color="#4f46e5" />
                </View>
                <Text style={styles.mediaDetailText} numberOfLines={1}>
                  {mediaMeta} • High Dynamic Range
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editMediaBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Ionicons name="options-outline" size={14} color="#475569" />
              <Text style={styles.editMediaBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Batch Controls Header */}
          <View style={styles.batchControlHeader}>
            <View style={styles.targetLabelGroup}>
              <Text style={styles.targetLabel}>Target Channels</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{activeCount} active</Text>
              </View>
            </View>

            <View style={styles.batchActions}>
              <TouchableOpacity onPress={selectAllPlatforms} activeOpacity={0.7}>
                <Text style={styles.selectAllText}>Select All</Text>
              </TouchableOpacity>
              <Text style={styles.dotSeparator}>•</Text>
              <TouchableOpacity onPress={clearPlatforms} activeOpacity={0.7}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Cards List */}
          <View style={styles.cardsGroup}>
            {PLATFORMS.map((plat) => {
              const isSelected = !!selectedPlatforms[plat.id];
              return (
                <TouchableOpacity
                  key={plat.id}
                  style={[
                    styles.platformCard,
                    !isSelected && styles.platformCardDisabled,
                  ]}
                  onPress={() => togglePlatform(plat.id)}
                  activeOpacity={0.85}>
                  <View style={styles.cardMainRow}>
                    <View style={styles.cardLeftContent}>
                      {/* Icon Plate */}
                      <View style={[styles.platformIconPlate, { backgroundColor: plat.iconBg }]}>
                        {plat.id === 'linkedin' && (
                          <Ionicons name="logo-linkedin" size={20} color={plat.iconColor} />
                        )}
                        {plat.id === 'instagram' && (
                          <Ionicons name="logo-instagram" size={20} color={plat.iconColor} />
                        )}
                        {plat.id === 'x' && (
                          <Ionicons name="logo-twitter" size={20} color={plat.iconColor} />
                        )}
                        {plat.id === 'reddit' && (
                          <Ionicons name="logo-reddit" size={20} color={plat.iconColor} />
                        )}
                      </View>

                      {/* Text info */}
                      <View style={styles.platformTexts}>
                        <View style={styles.platformTitleRow}>
                          <Text style={styles.platformName}>{plat.name}</Text>
                          <View
                            style={[
                              styles.platformBadge,
                              {
                                backgroundColor: plat.badgeBg,
                                borderColor: plat.badgeBorder,
                              },
                            ]}>
                            <Text style={[styles.platformBadgeText, { color: plat.badgeText }]}>
                              {plat.badge}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.formatDescription}>{plat.formatText}</Text>

                        {/* Metric Tags */}
                        <View style={styles.metricTagsRow}>
                          <View style={styles.metricTag}>
                            <Ionicons name={plat.tag1.icon} size={13} color="#64748b" />
                            <Text style={styles.metricTagText}>{plat.tag1.label}</Text>
                          </View>
                          <View style={styles.metricTag}>
                            <Ionicons name={plat.tag2.icon} size={13} color="#64748b" />
                            <Text style={styles.metricTagText}>{plat.tag2.label}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Custom Checkbox */}
                    <View
                      style={[
                        styles.customCheckbox,
                        isSelected ? styles.customCheckboxActive : styles.customCheckboxInactive,
                      ]}>
                      {isSelected && <Ionicons name="checkmark" size={15} color="#ffffff" />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Algorithmic Nuances Micro Banner */}
          <View style={styles.engineBanner}>
            <View style={styles.engineIconBox}>
              <Ionicons name="sparkles" size={16} color="#ffffff" />
            </View>
            <View style={styles.engineTexts}>
              <Text style={styles.engineTitle}>Post Plus Algorithm Engine</Text>
              <Text style={styles.engineSubtitle}>
                Applies platform-specific rate limits, word counts &amp; SEO weighting automatically.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}>
        <View style={styles.stickyInnerWrapper}>
          <TouchableOpacity
            style={[styles.generateButton, activeCount === 0 && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={activeCount === 0}
            activeOpacity={0.9}>
            <Text style={styles.generateButtonText}>
              {activeCount === 0
                ? 'Select a Platform to Continue'
                : `Generate ${activeCount} Platform Post${activeCount > 1 ? 's' : ''}`}
            </Text>
            <Ionicons name="sparkles-outline" size={18} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.stickyFooterRow}>
            <Text style={styles.stickyFooterText}>
              Step 2 of 3 • Uses channel-specific algorithmic guidelines
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    alignItems: 'center',
  },
  maxWidthWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flowCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepDoneLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  flowConnectorActive: {
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#4f46e5',
  },
  flowConnectorInactive: {
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#e2e8f0',
  },
  flowActiveCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowActiveNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  flowStepActiveLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
  },
  flowPendingCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowPendingNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  flowStepPendingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  headerIntro: {
    marginTop: 4,
    marginBottom: 16,
    gap: 4,
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headlineSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    lineHeight: 19,
  },
  mediaSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  mediaSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  thumbImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  mediaSummaryMeta: {
    flex: 1,
  },
  mediaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mediaNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  mediaDetailText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  editMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editMediaBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  batchControlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  targetLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
  },
  batchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4f46e5',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  clearText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748b',
  },
  cardsGroup: {
    gap: 12,
  },
  platformCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  platformCardDisabled: {
    opacity: 0.55,
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  platformIconPlate: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  platformTexts: {
    flex: 1,
  },
  platformTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  platformBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  formatDescription: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 17,
  },
  metricTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  metricTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricTagText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCheckboxActive: {
    backgroundColor: '#4f46e5',
  },
  customCheckboxInactive: {
    backgroundColor: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  engineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    padding: 12,
    marginTop: 18,
  },
  engineIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineTexts: {
    flex: 1,
  },
  engineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  engineSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  stickyBottomBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        bottom: 0,
        backdropFilter: 'blur(16px)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  },
  stickyInnerWrapper: {
    width: '100%',
    maxWidth: 520,
    gap: 8,
    alignItems: 'center',
  },
  generateButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  generateButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  stickyFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyFooterText: {
    fontSize: 11,
    color: '#64748b',
  },
});

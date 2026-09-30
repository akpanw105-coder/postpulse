import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostPlusHeader } from '@/components/post-plus-header';
import { useCreator, PlatformId } from '@/context/creator-context';

interface PostContent {
  title?: string;
  body: string;
  hashtags?: string;
  footerNote?: string;
}

const INITIAL_POSTS: Record<PlatformId, PostContent[]> = {
  linkedin: [
    {
      body: `The most productive design sessions don't start in Figma. They start on paper.

Over the last 6 months, stepping away from notifications with a simple notebook and morning coffee before touching pixels doubled our sprint velocity.

Here are 3 rituals I swear by:
1. Sketch wireframes without color or auto-layout bias.
2. Write product intent before building components.
3. Keep your desk clutter-free to preserve cognitive bandwidth.

How do you structure your creative focus time?`,
      hashtags: '#DesignEngineering #Productivity #CreativeProcess',
    },
    {
      body: `Design systems are only as resilient as the principles behind them.

Before committing to tokens or component libraries, define your core constraints. In our studio, we test every pattern against three criteria: clarity, durability, and tactile satisfaction.

When the fundamentals are solid, shipping becomes second nature.`,
      hashtags: '#DesignSystems #UIUX #EngineeringCulture',
    },
  ],
  instagram: [
    {
      body: `Analog morning, digital afternoon ☕️📐

Before opening Figma, I spend 30 minutes mapping out screen hierarchies by hand. It forces clarity before getting lost in typography details.

Save this for your next creative block.`,
      hashtags: '#designerlife #minimalsetup #workspacegoals #studiodesk',
    },
    {
      body: `Space to think = room to create ✨

A clean workspace isn't about minimalism for aesthetics—it's about removing visual noise so the work can speak.

Drop a comment with your must-have desk item 👇`,
      hashtags: '#workspaceinspo #creativestudio #minimalistworkspace',
    },
  ],
  x: [
    {
      body: `Stop opening Figma first thing in the morning.

30 mins with pencil + paper saves 3 hours of endless component restructuring later.

Fewer tools, clearer thinking.`,
      footerNote: '62 chars remaining',
    },
    {
      body: `The best design engineers I know do 80% of the thinking before writing a single style rule.

Map the state machine first. The UI follows effortlessly.`,
      footerNote: '78 chars remaining',
    },
  ],
  reddit: [
    {
      title: 'Why going analog for the first 30 mins transformed my design workflow',
      body: `Hey everyone, wanted to share an observation. I used to jump straight into layout tools and immediately obsess over pixel alignment. Recently switched to sketching layout hierarchies in an analog sketchbook over coffee. Has anyone else noticed massive velocity gains from delaying high-fidelity prototyping?`,
      footerNote: 'No hashtags included (Reddit guideline compliant)',
    },
    {
      title: 'Minimalist studio setup & rituals for sustained deep work sprints',
      body: `Curious how other designers and front-end devs manage cognitive load during heavy sprint cycles. After stripping my desk down to just a notepad, phone dock, and coffee, focus duration jumped significantly. What does your distraction-free setup look like?`,
      footerNote: 'No hashtags included (Reddit guideline compliant)',
    },
  ],
};

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { mediaUri, mediaName, selectedPlatforms, resetAll } = useCreator();

  // Active filter tab: 'all' or specific platform
  const [activeFilter, setActiveFilter] = useState<'all' | PlatformId>('all');
  const [postVariations, setPostVariations] = useState<Record<PlatformId, number>>({
    linkedin: 0,
    instagram: 0,
    x: 0,
    reddit: 0,
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleCopyPost = async (platformId: PlatformId, text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedKey(platformId);
      showToast(`${platformId.toUpperCase()} post copied!`);
      setTimeout(() => setCopiedKey(null), 1000);
    } catch {
      showToast('Copied to clipboard');
    }
  };

  const handleRegenerate = (platformId: PlatformId) => {
    setPostVariations((prev) => ({
      ...prev,
      [platformId]: (prev[platformId] + 1) % INITIAL_POSTS[platformId].length,
    }));
    showToast('Refined copy with tailored nuances...');
  };

  const handleCopyAll = async () => {
    const allText = (['linkedin', 'instagram', 'x', 'reddit'] as PlatformId[])
      .filter((id) => selectedPlatforms[id])
      .map((id) => {
        const post = INITIAL_POSTS[id][postVariations[id]];
        return `=== ${id.toUpperCase()} ===\n${post.title ? post.title + '\n\n' : ''}${post.body}\n${
          post.hashtags || ''
        }\n`;
      })
      .join('\n\n');

    await Clipboard.setStringAsync(allText);
    showToast('All platform posts copied to clipboard!');
  };

  const handleReset = () => {
    Alert.alert('Reset Creation', 'Start over from upload step?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetAll();
          router.replace('/');
        },
      },
    ]);
  };

  const handleExport = () => {
    showToast('Export bundle generated (Markdown + Assets)');
  };

  const handleSaveQueue = () => {
    showToast('Saved to Content Queue successfully!');
  };

  const enabledPlatforms = (['linkedin', 'instagram', 'x', 'reddit'] as PlatformId[]).filter(
    (id) => selectedPlatforms[id]
  );

  return (
    <View style={styles.screen}>
      <PostPlusHeader
        subtitle="Publish Review Step 3"
        stepText="Step 3 of 3"
        progressPercent={100}
        canGoBack={true}
        onBack={() => router.back()}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={styles.floatingToast}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.floatingToastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 84 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Stepper Progress Status */}
          <View style={styles.flowRow}>
            {/* Step 1 Check */}
            <View style={styles.flowStep}>
              <View style={styles.flowCheckCircle}>
                <Ionicons name="checkmark" size={13} color="#10b981" />
              </View>
              <Text style={styles.flowStepDoneLabel}>1. Upload</Text>
            </View>

            <View style={styles.flowLine} />

            {/* Step 2 Check */}
            <View style={styles.flowStep}>
              <View style={styles.flowCheckCircle}>
                <Ionicons name="checkmark" size={13} color="#10b981" />
              </View>
              <Text style={styles.flowStepDoneLabel}>2. Platforms</Text>
            </View>

            <View style={styles.flowLine} />

            {/* Step 3 Active */}
            <View style={styles.flowStep}>
              <View style={styles.flowActiveCircle}>
                <Text style={styles.flowActiveNumber}>3</Text>
              </View>
              <Text style={styles.flowStepActiveLabel}>Results</Text>
            </View>
          </View>

          {/* Summary Control Bar */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryLeft}>
              <View style={styles.pulseDot} />
              <View>
                <Text style={styles.summaryTitle}>{enabledPlatforms.length} Posts Ready</Text>
                <Text style={styles.summarySubtitle}>Tailored voice &amp; metadata tuned</Text>
              </View>
            </View>

            <View style={styles.summaryActions}>
              <TouchableOpacity style={styles.summaryBtn} onPress={handleReset} activeOpacity={0.7}>
                <Ionicons name="refresh-outline" size={15} color="#475569" />
                <Text style={styles.summaryBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.summaryExportBtn}
                onPress={handleExport}
                activeOpacity={0.7}>
                <Ionicons name="share-outline" size={15} color="#4f46e5" />
                <Text style={styles.summaryExportBtnText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Jumping Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsScroll}
            contentContainerStyle={styles.pillsContainer}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
              activeOpacity={0.8}>
              {activeFilter === 'all' && <View style={styles.pillWhiteDot} />}
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'all' && styles.filterPillTextActive,
                ]}>
                All ({enabledPlatforms.length})
              </Text>
            </TouchableOpacity>

            {enabledPlatforms.includes('linkedin') && (
              <TouchableOpacity
                style={[styles.filterPill, activeFilter === 'linkedin' && styles.filterPillActive]}
                onPress={() => setActiveFilter('linkedin')}
                activeOpacity={0.8}>
                <Ionicons
                  name="briefcase-outline"
                  size={14}
                  color={activeFilter === 'linkedin' ? '#ffffff' : '#0a66c2'}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === 'linkedin' && styles.filterPillTextActive,
                  ]}>
                  LinkedIn
                </Text>
              </TouchableOpacity>
            )}

            {enabledPlatforms.includes('instagram') && (
              <TouchableOpacity
                style={[styles.filterPill, activeFilter === 'instagram' && styles.filterPillActive]}
                onPress={() => setActiveFilter('instagram')}
                activeOpacity={0.8}>
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={activeFilter === 'instagram' ? '#ffffff' : '#e1306c'}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === 'instagram' && styles.filterPillTextActive,
                  ]}>
                  Instagram
                </Text>
              </TouchableOpacity>
            )}

            {enabledPlatforms.includes('x') && (
              <TouchableOpacity
                style={[styles.filterPill, activeFilter === 'x' && styles.filterPillActive]}
                onPress={() => setActiveFilter('x')}
                activeOpacity={0.8}>
                <Ionicons
                  name="pricetag-outline"
                  size={14}
                  color={activeFilter === 'x' ? '#ffffff' : '#0f172a'}
                />
                <Text
                  style={[styles.filterPillText, activeFilter === 'x' && styles.filterPillTextActive]}>
                  X
                </Text>
              </TouchableOpacity>
            )}

            {enabledPlatforms.includes('reddit') && (
              <TouchableOpacity
                style={[styles.filterPill, activeFilter === 'reddit' && styles.filterPillActive]}
                onPress={() => setActiveFilter('reddit')}
                activeOpacity={0.8}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={14}
                  color={activeFilter === 'reddit' ? '#ffffff' : '#ff4500'}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === 'reddit' && styles.filterPillTextActive,
                  ]}>
                  Reddit
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Cards Feed */}
          <View style={styles.cardsFeed}>
            {/* 1. LinkedIn Card */}
            {(activeFilter === 'all' || activeFilter === 'linkedin') &&
              enabledPlatforms.includes('linkedin') && (
                <View style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.platformIconSquare, { backgroundColor: '#eff6ff' }]}>
                        <Ionicons name="briefcase" size={17} color="#0a66c2" />
                      </View>
                      <View>
                        <Text style={styles.cardPlatformTitle}>LinkedIn Post</Text>
                        <Text style={styles.cardPlatformMeta}>Professional Network • 942 chars</Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <TouchableOpacity
                        style={styles.cardRegenBtn}
                        onPress={() => handleRegenerate('linkedin')}
                        activeOpacity={0.7}>
                        <Ionicons name="sync" size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.cardCopyBtn,
                          copiedKey === 'linkedin' && styles.cardCopyBtnSuccess,
                        ]}
                        onPress={() => {
                          const p = INITIAL_POSTS.linkedin[postVariations.linkedin];
                          handleCopyPost('linkedin', `${p.body}\n\n${p.hashtags}`);
                        }}
                        activeOpacity={0.8}>
                        <Ionicons
                          name={copiedKey === 'linkedin' ? 'checkmark' : 'copy-outline'}
                          size={14}
                          color={copiedKey === 'linkedin' ? '#059669' : '#4f46e5'}
                        />
                        <Text
                          style={[
                            styles.cardCopyBtnText,
                            copiedKey === 'linkedin' && styles.cardCopyBtnTextSuccess,
                          ]}>
                          {copiedKey === 'linkedin' ? 'Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Body Block */}
                  <View style={styles.postBodyContainer}>
                    <Text style={styles.postBodyText}>
                      {INITIAL_POSTS.linkedin[postVariations.linkedin].body}
                    </Text>
                    <Text style={styles.postHashtags}>
                      {INITIAL_POSTS.linkedin[postVariations.linkedin].hashtags}
                    </Text>
                  </View>

                  {/* Attached Media Strip */}
                  <View style={styles.mediaStrip}>
                    <Image source={{ uri: mediaUri }} style={styles.mediaStripThumb} />
                    <View style={styles.mediaStripMeta}>
                      <Text style={styles.mediaStripFilename} numberOfLines={1}>
                        {mediaName}
                      </Text>
                      <Text style={styles.mediaStripNote}>Attached high-res image • 1080 × 1080px</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                  </View>
                </View>
              )}

            {/* 2. Instagram Card */}
            {(activeFilter === 'all' || activeFilter === 'instagram') &&
              enabledPlatforms.includes('instagram') && (
                <View style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.platformIconSquare, { backgroundColor: '#fdf2f8' }]}>
                        <Ionicons name="camera" size={17} color="#db2777" />
                      </View>
                      <View>
                        <Text style={styles.cardPlatformTitle}>Instagram Caption</Text>
                        <Text style={styles.cardPlatformMeta}>Visual Feed • Carousel/Single Post</Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <TouchableOpacity
                        style={styles.cardRegenBtn}
                        onPress={() => handleRegenerate('instagram')}
                        activeOpacity={0.7}>
                        <Ionicons name="sync" size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.cardCopyBtn,
                          copiedKey === 'instagram' && styles.cardCopyBtnSuccess,
                        ]}
                        onPress={() => {
                          const p = INITIAL_POSTS.instagram[postVariations.instagram];
                          handleCopyPost('instagram', `${p.body}\n\n${p.hashtags}`);
                        }}
                        activeOpacity={0.8}>
                        <Ionicons
                          name={copiedKey === 'instagram' ? 'checkmark' : 'copy-outline'}
                          size={14}
                          color={copiedKey === 'instagram' ? '#059669' : '#4f46e5'}
                        />
                        <Text
                          style={[
                            styles.cardCopyBtnText,
                            copiedKey === 'instagram' && styles.cardCopyBtnTextSuccess,
                          ]}>
                          {copiedKey === 'instagram' ? 'Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Large Media Preview for Instagram */}
                  <View style={styles.instagramMediaBox}>
                    <Image source={{ uri: mediaUri }} style={styles.instagramMediaImage} />
                    <View style={styles.carouselBadge}>
                      <Ionicons name="layers-outline" size={12} color="#4f46e5" />
                      <Text style={styles.carouselBadgeText}>1/1</Text>
                    </View>
                  </View>

                  <View style={styles.postBodyContainer}>
                    <Text style={styles.postBodyText}>
                      {INITIAL_POSTS.instagram[postVariations.instagram].body}
                    </Text>
                    <Text style={styles.postHashtags}>
                      {INITIAL_POSTS.instagram[postVariations.instagram].hashtags}
                    </Text>
                  </View>
                </View>
              )}

            {/* 3. X Card */}
            {(activeFilter === 'all' || activeFilter === 'x') &&
              enabledPlatforms.includes('x') && (
                <View style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.platformIconSquare, { backgroundColor: '#f1f5f9' }]}>
                        <Ionicons name="logo-twitter" size={17} color="#0f172a" />
                      </View>
                      <View>
                        <Text style={styles.cardPlatformTitle}>X Post</Text>
                        <Text style={styles.cardPlatformMeta}>Micro-narrative • 218/280 chars</Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <TouchableOpacity
                        style={styles.cardRegenBtn}
                        onPress={() => handleRegenerate('x')}
                        activeOpacity={0.7}>
                        <Ionicons name="sync" size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cardCopyBtn, copiedKey === 'x' && styles.cardCopyBtnSuccess]}
                        onPress={() => {
                          const p = INITIAL_POSTS.x[postVariations.x];
                          handleCopyPost('x', p.body);
                        }}
                        activeOpacity={0.8}>
                        <Ionicons
                          name={copiedKey === 'x' ? 'checkmark' : 'copy-outline'}
                          size={14}
                          color={copiedKey === 'x' ? '#059669' : '#4f46e5'}
                        />
                        <Text
                          style={[
                            styles.cardCopyBtnText,
                            copiedKey === 'x' && styles.cardCopyBtnTextSuccess,
                          ]}>
                          {copiedKey === 'x' ? 'Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.postBodyContainer}>
                    <Text style={styles.postBodyText}>
                      {INITIAL_POSTS.x[postVariations.x].body}
                    </Text>

                    <View style={styles.xMetaFooter}>
                      <View style={styles.xAttachmentPill}>
                        <Ionicons name="image-outline" size={13} color="#4f46e5" />
                        <Text style={styles.xAttachmentText}>{mediaName} attached</Text>
                      </View>
                      <View style={styles.xCharsRemainingPill}>
                        <Text style={styles.xCharsRemainingText}>
                          {INITIAL_POSTS.x[postVariations.x].footerNote}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

            {/* 4. Reddit Card */}
            {(activeFilter === 'all' || activeFilter === 'reddit') &&
              enabledPlatforms.includes('reddit') && (
                <View style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.platformIconSquare, { backgroundColor: '#fff7ed' }]}>
                        <Ionicons name="logo-reddit" size={17} color="#ea580c" />
                      </View>
                      <View>
                        <Text style={styles.cardPlatformTitle}>Reddit Post</Text>
                        <Text style={styles.cardPlatformMeta}>Community Thread • r/webdesign</Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <TouchableOpacity
                        style={styles.cardRegenBtn}
                        onPress={() => handleRegenerate('reddit')}
                        activeOpacity={0.7}>
                        <Ionicons name="sync" size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.cardCopyBtn,
                          copiedKey === 'reddit' && styles.cardCopyBtnSuccess,
                        ]}
                        onPress={() => {
                          const p = INITIAL_POSTS.reddit[postVariations.reddit];
                          handleCopyPost('reddit', `${p.title}\n\n${p.body}`);
                        }}
                        activeOpacity={0.8}>
                        <Ionicons
                          name={copiedKey === 'reddit' ? 'checkmark' : 'copy-outline'}
                          size={14}
                          color={copiedKey === 'reddit' ? '#059669' : '#4f46e5'}
                        />
                        <Text
                          style={[
                            styles.cardCopyBtnText,
                            copiedKey === 'reddit' && styles.cardCopyBtnTextSuccess,
                          ]}>
                          {copiedKey === 'reddit' ? 'Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.postBodyContainer}>
                    <View style={styles.redditTitleBlock}>
                      <Text style={styles.redditSuggestedLabel}>SUGGESTED TITLE</Text>
                      <Text style={styles.redditTitleText}>
                        {INITIAL_POSTS.reddit[postVariations.reddit].title}
                      </Text>
                    </View>

                    <View style={styles.redditDivider} />

                    <Text style={styles.postBodyText}>
                      {INITIAL_POSTS.reddit[postVariations.reddit].body}
                    </Text>

                    <View style={styles.redditComplianceRow}>
                      <Ionicons name="shield-checkmark" size={14} color="#10b981" />
                      <Text style={styles.redditComplianceText}>
                        {INITIAL_POSTS.reddit[postVariations.reddit].footerNote}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}>
        <View style={styles.stickyActionRow}>
          <TouchableOpacity
            style={styles.queueButton}
            onPress={handleSaveQueue}
            activeOpacity={0.8}>
            <Ionicons name="layers-outline" size={17} color="#475569" />
            <Text style={styles.queueButtonText}>Queue All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.copyAllButton}
            onPress={handleCopyAll}
            activeOpacity={0.85}>
            <Ionicons name="checkmark-done" size={17} color="#ffffff" />
            <Text style={styles.copyAllButtonText}>Copy All ({enabledPlatforms.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fafafc',
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
  floatingToast: {
    position: 'absolute',
    top: 68,
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8,
  },
  floatingToastText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '600',
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepDoneLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  flowLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  flowActiveCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
    textTransform: 'uppercase',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pulseDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10b981',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  summarySubtitle: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 1,
  },
  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  summaryExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  summaryExportBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4f46e5',
  },
  pillsScroll: {
    marginBottom: 14,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  pillWhiteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  cardsFeed: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  platformIconSquare: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardPlatformTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardPlatformMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardRegenBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  cardCopyBtnSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  cardCopyBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4f46e5',
  },
  cardCopyBtnTextSuccess: {
    color: '#059669',
  },
  postBodyContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 8,
  },
  postBodyText: {
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 19,
  },
  postHashtags: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  mediaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
  },
  mediaStripThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  mediaStripMeta: {
    flex: 1,
  },
  mediaStripFilename: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  mediaStripNote: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 2,
  },
  instagramMediaBox: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instagramMediaImage: {
    width: '100%',
    height: '100%',
  },
  carouselBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  carouselBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  xMetaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  xAttachmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  xAttachmentText: {
    fontSize: 10.5,
    color: '#64748b',
  },
  xCharsRemainingPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  xCharsRemainingText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4f46e5',
  },
  redditTitleBlock: {
    gap: 3,
  },
  redditSuggestedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ea580c',
    letterSpacing: 0.5,
  },
  redditTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 18,
  },
  redditDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 2,
  },
  redditComplianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 2,
  },
  redditComplianceText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#64748b',
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
  stickyActionRow: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    gap: 10,
  },
  queueButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  queueButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  copyAllButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  copyAllButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
  },
});

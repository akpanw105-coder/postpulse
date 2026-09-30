import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface PostPlusHeaderProps {
  title?: string;
  subtitle: string;
  stepText: string;
  progressPercent: number; // 0 to 100
  canGoBack?: boolean;
  onBack?: () => void;
}

export function PostPlusHeader({
  title = 'Post Plus',
  subtitle,
  stepText,
  progressPercent,
  canGoBack = false,
  onBack,
}: PostPlusHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          {canGoBack && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>
          )}

          {/* Logo Brand Mark */}
          <View style={styles.logoBadge}>
            <View style={styles.logoSquare1}>
              <View style={styles.logoSquare2}>
                <Ionicons name="add" size={12} color="#0f172a" />
              </View>
            </View>
          </View>

          <View style={styles.titles}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.subtitleText}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>{stepText}</Text>
          </View>
          <View style={styles.avatarButton}>
            <Ionicons name="person" size={16} color="#4f46e5" />
          </View>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.trackBackground}>
        <View style={[styles.trackFill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    zIndex: 50,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        backdropFilter: 'blur(16px)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  topRow: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logoSquare1: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquare2: {
    width: 14,
    height: 14,
    borderRadius: 3.5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  stepPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4f46e5',
  },
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBackground: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
});

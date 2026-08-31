import React from 'react';
import { EmptyState, ScreenContainer } from '../../../components';

/** Placeholder shell — replaced when this feature is implemented. */
export const NowPlayingScreen: React.FC = () => (
  <ScreenContainer>
    <EmptyState title="Now playing" message="Playback controls land with the player step." />
  </ScreenContainer>
);

import React, { FC } from 'react';
import styled from 'styled-components';

import { SettingsButton } from './buttons/settings-button';

const Bar = styled.div({
  position: 'relative',
  gridArea: 'Statusbar',
  borderTop: '1px solid var(--hl-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
});

export const StatusBar: FC = () => {
  return (
    <Bar>
      <SettingsButton />
    </Bar>
  );
};

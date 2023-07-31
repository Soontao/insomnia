import React, { Fragment } from 'react';
import styled from 'styled-components';

import * as session from '../../account/session';
import { Dropdown, DropdownButton, DropdownItem, ItemContent } from './base/dropdown';
import { SvgIcon } from './svg-icon';

const Toolbar = styled.div({
  display: 'flex',
  alignItems: 'center',
  paddingRight: 'var(--padding-sm)',
  gap: 'var(--padding-sm)',
  margin: 0,
});

export const AccountToolbar = () => {
  const isLoggedIn = session.isLoggedIn();

  return (
    <Toolbar>
      {isLoggedIn ? (
        <Dropdown
          aria-label="Account"
          triggerButton={
            <DropdownButton
              style={{ gap: 'var(--padding-xs)' }}
              removePaddings={false}
              disableHoverBehavior={false}
            >
              <SvgIcon icon='user' />{session.getFirstName()} {session.getLastName()}<i className="fa fa-caret-down" />
            </DropdownButton>
          }
        >
          <DropdownItem
            key="account-settings"
            aria-label="Account settings"
          >
            <ItemContent
              icon="gear"
              label='Account Settings'
              stayOpenAfterClick
              onClick={() => window.main.openInBrowser('https://app.insomnia.rest/app/account/')}
            />
          </DropdownItem>
          <DropdownItem
            key="logout"
            aria-label='logout'
          >
            <ItemContent
              icon="sign-out"
              label="Logout"
              withPrompt
              stayOpenAfterClick
              onClick={session.logout}
            />
          </DropdownItem>
        </Dropdown>
      ) : (
          <Fragment />
      )}
    </Toolbar>
  );
};

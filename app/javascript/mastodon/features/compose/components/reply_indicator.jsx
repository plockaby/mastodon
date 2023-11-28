import { FormattedMessage } from 'react-intl';

import { useSelector } from 'react-redux';

import { ReactComponent as BarChart4BarsIcon } from '@material-symbols/svg-600/outlined/bar_chart_4_bars.svg';
import { ReactComponent as PhotoLibraryIcon } from '@material-symbols/svg-600/outlined/photo_library.svg';

import { Avatar } from 'mastodon/components/avatar';
import { DisplayName } from 'mastodon/components/display_name';
import { Icon } from 'mastodon/components/icon';

export const ReplyIndicator = () => {
  const inReplyToId = useSelector(state => state.getIn(['compose', 'in_reply_to']));
  const status = useSelector(state => state.getIn(['statuses', inReplyToId]));
  const account = useSelector(state => state.getIn(['accounts', status?.get('account')]));

  if (!status) {
    return null;
  }

  const content = { __html: status.get('contentHtml') };

  return (
    <div className='reply-indicator'>
      <div className='reply-indicator__line' />

      <Avatar account={account} size={46} />
      <DisplayName account={account} />

      <div className='reply-indicator__content translate' dangerouslySetInnerHTML={content} />

      {(status.get('poll') || status.get('media_attachments').size > 0) && (
        <div className='reply-indicator__attachments'>
          {status.get('poll') && <><Icon icon={BarChart4BarsIcon} /><FormattedMessage id='reply_indicator.poll' defaultMessage='Poll' /></>}
          {status.get('media_attachments').size > 0 && <><Icon icon={PhotoLibraryIcon} /><FormattedMessage id='reply_indicator.attachments' defaultMessage='{count, plural, one {# attachment} other {# attachments}}' values={{ count: status.get('media_attachments').size }} /></>}
        </div>
      )}
    </div>
  );
};

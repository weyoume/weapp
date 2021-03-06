import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { currentUserFollowsUser } from '../helpers/apiHelpers';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getFollowingList,
  getMutualList,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
} from '../reducers';
import { 
  getFollowing, 
} from '../user/userActions';
import { openTransfer } from '../wallet/walletActions';
import { getAccount } from './usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    followingList: getFollowingList(state),
    mutualList: getMutualList(state),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
  }),
  {
    getAccount,
    getFollowing,
    openTransfer,
  },
)
export default class User extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    mutualList: PropTypes.arrayOf(PropTypes.string).isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getAccount: PropTypes.func,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getAccount: () => {},
    openTransfer: () => {},
  };

  static async fetchData({ store, match }) {
    const { name } = match.params;
    return Promise.all([
      store.dispatch(getAccount(name)),
    ]);
  }

  componentDidMount() {
    const { 
      user,
      match, 
    } = this.props;

    const { 
      name
    } = match.params;

    if (_.isEmpty(user) || (!user.id && !user.error)) {
      this.props.getAccount(name);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccount(this.props.match.params.name);
    }
  }

  handleTransferClick = () => {
    this.transfer = {
      to: this.props.match.params.name,
      amount: 0,
      memo: " ",
      currency: 'TME',
      type: 'transfer',
      callBack: window.location.href,
    };
    this.props.openTransfer(this.transfer);
  };

  render() {
    const { authenticated, authenticatedUser, followingList, mutualList, loaded, failed, user } = this.props;
    if (failed) return <Error404 />;

    const username = user.name;
    const profile = _.get(user, 'profile', {} );
    const busyHost = global.postOrigin || 'https://alpha.weyoume.io';
    const desc = profile.about || `Posts by ${username}`;
    const image = getAvatarURL(username) || '/images/logo-icon.png';
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const hasCover = !!profile.cover_image;
    const title = `${displayedUsername} - WeYouMe`;

    const isSameUser = authenticated && authenticatedUser.name === username;
    const isFollowing = followingList.includes(username);
    const isMutual = mutualList.includes(username);

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="WeYouMe" />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            ownName={authenticatedUser.name}
            username={displayedUsername}
            isSameUser={isSameUser}
            coverImage={profile.cover_image}
            isFollowing={isFollowing}
            isMutual={isMutual}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
            onTransferClick={this.handleTransferClick}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            {loaded && <div className="center">{renderRoutes(this.props.route.routes)}</div>}
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
          </div>
        </div>
      </div>
    );
  }
}

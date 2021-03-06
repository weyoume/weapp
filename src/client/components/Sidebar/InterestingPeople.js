import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import User from './User';
import { Button } from 'antd';
import './InterestingPeople.less';
import './SidebarContentBlock.less';

const InterestingPeople = ({ users, onRefresh, isFetchingNetworkUserList }) => (
  <div className="InterestingPeople SidebarContentBlock">
    <h4 className="SidebarContentBlock__title">
      <i className="iconfont icon-group SidebarContentBlock__icon" />{' '}
      <FormattedMessage id="interesting_people" defaultMessage="Discover" />
      <button onClick={onRefresh} className="InterestingPeople__button-refresh">
        <i className="iconfont icon-refresh" />
      </button>
    </h4>
    <div className="SidebarContentBlock__content">
      {!isFetchingNetworkUserList && users && users.map(user => <User key={`recommendation-${user.name}`} user={user} />)}
      <h4 className="InterestingPeople__more">
        <Link to={'/invite'}>
          <Button> 
            <FormattedMessage id="invite_people" defaultMessage="Invite Friends" />
          </Button> 
        </Link>
      </h4>
    </div>
  </div>
);

InterestingPeople.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  onRefresh: PropTypes.func,
};

InterestingPeople.defaultProps = {
  users: [],
  onRefresh: () => {},
};

export default InterestingPeople;

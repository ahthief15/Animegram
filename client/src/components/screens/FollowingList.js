import React from 'react';
import UserList from '../UserList';

const FollowingList = ({ currentUser }) => {
    const filterFollowing = user => user?.followers?.includes(currentUser?._id);

    return (
        <UserList
            title="Following List"
            filterFn={filterFollowing}
        />
    );
};

export default FollowingList;

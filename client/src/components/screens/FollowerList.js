import React from 'react';
import UserList from '../UserList';

const FollowerList = ({ currentUser }) => {
    const filterFollowers = user => user?.following.includes(currentUser?._id);

    return (
        <UserList
            title="Followers List"
            filterFn={filterFollowers}
        />
    );
};

export default FollowerList;

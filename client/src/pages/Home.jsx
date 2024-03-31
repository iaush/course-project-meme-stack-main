import React from 'react';

function Home({user, ...props}) {
    return (
        <div>Hi, {user.name}!</div>
    );
}

export default Home;
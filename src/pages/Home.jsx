import { User, UserProfile } from "@asgardeo/react";

const Home = () => {
  return (
    <>
      <br></br>
      <hr></hr>

      <h2>Home page</h2>
      <div>This is the homepage</div>
{/* 
      <User>
        {(user) => (
          <div>
            <p>Welcome back, {user.userName || user.username || user.sub}</p>
          </div>
        )}
      </User>

      <UserProfile />
       */}
      <br></br>
    </>
  );
};

export default Home;

import { useAuth } from "../hooks/UseAuth";

function Home() {
  const { user, loading } = useAuth();

  // if (loading) return <p>Loading...</p>;
  // if (!user) return <p>No user logged in</p>;

  return (
    <div>
      {/* <h1>Welcome {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>User kind: {user.user_kind}</p>
      <p>Phone: {user.phone}</p> */}


    </div>
  );
}

export default Home;

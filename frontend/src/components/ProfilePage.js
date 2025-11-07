import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  color: var(--galaxy-text-primary);
  padding: var(--spacing-2xl) var(--spacing-xl);
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProfileCard = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.6);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 var(--spacing-sm) 0;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: var(--galaxy-text-secondary);
  margin: 0;
  font-size: 1.1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-blue)' : 'transparent'};
  color: ${props => props.active ? 'var(--galaxy-text-primary)' : 'var(--galaxy-text-secondary)'};
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  
  &:hover {
    color: var(--galaxy-text-primary);
    background: rgba(102, 126, 234, 0.15);
  }
`;

const TabContent = styled.div`
  padding: var(--spacing-xl) 0;
`;

const SettingsSection = styled.div`
  margin-bottom: var(--spacing-2xl);
`;

const SectionTitle = styled.h2`
  color: var(--galaxy-text-primary);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  background: ${props => props.connected ? 'rgba(76, 175, 80, 0.1)' : 'rgba(102, 126, 234, 0.05)'};
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  border: 1px solid ${props => props.connected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(102, 126, 234, 0.2)'};
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.1rem;
`;

const SettingDescription = styled.div`
  font-size: 0.95rem;
  color: var(--galaxy-text-secondary);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: var(--spacing-sm);
  background: ${props => props.connected ? '#4caf50' : 'rgba(102, 126, 234, 0.3)'};
  color: white;
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: ${props => props.danger ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)' : 'var(--accent-gradient)'};
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-primary);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: var(--background-surface);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.3);
`;

const ModalTitle = styled.h2`
  color: var(--galaxy-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
  font-size: 1.75rem;
`;

const ModalText = styled.p`
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
`;

const InfoSection = styled.div`
  padding: var(--spacing-xl);
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  color: var(--galaxy-text-secondary);
  font-size: 1.1rem;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xl);
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(5px);
    border-color: var(--accent-blue);
  }
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: var(--spacing-lg);
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--galaxy-text-primary);
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const UserBio = styled.div`
  color: var(--galaxy-text-secondary);
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--galaxy-text-secondary);
  font-size: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  color: var(--galaxy-text-tertiary);
  font-size: 1.1rem;
`;

const StatsRow = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  text-align: center;
  cursor: pointer;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.2);
  min-width: 120px;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    transform: translateY(-4px);
    border-color: var(--accent-blue);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-blue);
  margin-bottom: var(--spacing-sm);
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: var(--galaxy-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const SearchSection = styled.div`
  margin-bottom: var(--spacing-2xl);
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: var(--spacing-xl);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius);
  color: var(--galaxy-text-primary);
  font-size: 1rem;
  font-family: var(--font-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-blue);
    background: rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: var(--galaxy-text-tertiary);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--galaxy-text-tertiary);
  pointer-events: none;
`;

const SuggestionsTitle = styled.h3`
  color: var(--galaxy-text-primary);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
`;

const FollowButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: ${props => props.following ? 'rgba(102, 126, 234, 0.2)' : 'var(--accent-gradient)'};
  color: white;
  border: ${props => props.following ? '1px solid var(--accent-blue)' : 'none'};
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  min-width: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;


function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [userInfo, setUserInfo] = useState(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyDisplayName, setSpotifyDisplayName] = useState('');
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (activeTab === 'friends' || activeTab === 'followers' || activeTab === 'following') {
      fetchFollowers();
      fetchFollowing();
      if (activeTab === 'friends') {
        fetchSuggestions();
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get user profile info
      const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setUserInfo(response.data);

      // Check Spotify connection from user profile data
      if (response.data.spotify_connected) {
        setSpotifyConnected(true);
        if (response.data.spotify_display_name) {
          setSpotifyDisplayName(response.data.spotify_display_name);
        }
      } else {
        setSpotifyConnected(false);
        setSpotifyDisplayName('');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounts/followers/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setFollowers(response.data.followers || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounts/following/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setFollowing(response.data.following || []);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounts/recommendations/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSuggestions(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounts/users/search/?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (username) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/accounts/follow/${username}/`,
        {},
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      
      // Refresh data
      fetchFollowing();
      fetchFollowers();
      fetchSuggestions();
      if (searchQuery) searchUsers();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleDisconnectSpotify = async () => {
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/spotify/disconnect/`,
        {},
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );

      if (response.data.success) {
        setSpotifyConnected(false);
        setSpotifyDisplayName('');
        setShowDisconnectModal(false);
        // Refresh user info to update the UI
        await fetchUserInfo();
        alert('Spotify has been disconnected from your account');
      }
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      alert('Failed to disconnect Spotify. Please try again.');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <PageContainer>
      <ProfileCard>
        <Header>
          <Title>{userInfo?.username || 'Profile'}</Title>
          <Subtitle>Friends & Connections</Subtitle>
        </Header>

        <TabContainer>
          <Tab active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
            Friends
          </Tab>
          <Tab active={activeTab === 'followers'} onClick={() => setActiveTab('followers')}>
            Followers ({followers.length})
          </Tab>
          <Tab active={activeTab === 'following'} onClick={() => setActiveTab('following')}>
            Following ({following.length})
          </Tab>
          <Tab active={activeTab === 'account'} onClick={() => setActiveTab('account')}>
            Account
          </Tab>
          <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Settings
          </Tab>
        </TabContainer>

        <TabContent>
          {activeTab === 'friends' && (
            <div>
              <SearchSection>
                <SearchBar>
                  <SearchInput
                    type="text"
                    placeholder="Search users to add..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon>🔍</SearchIcon>
                </SearchBar>

                {searchQuery && (
                  <>
                    <SuggestionsTitle>Search Results</SuggestionsTitle>
                    {searching ? (
                      <LoadingMessage>Searching...</LoadingMessage>
                    ) : searchResults.length > 0 ? (
                      <UserList>
                        {searchResults.map((user, index) => (
                          <UserCard key={index}>
                            <UserAvatar>
                              {user.username.charAt(0).toUpperCase()}
                            </UserAvatar>
                            <UserDetails>
                              <UserName>{user.username}</UserName>
                              {user.bio && <UserBio>{user.bio}</UserBio>}
                            </UserDetails>
                            <FollowButton 
                              following={user.is_following}
                              onClick={() => handleFollow(user.username)}
                            >
                              {user.is_following ? 'Following' : 'Follow'}
                            </FollowButton>
                          </UserCard>
                        ))}
                      </UserList>
                    ) : (
                      <EmptyMessage>No users found</EmptyMessage>
                    )}
                  </>
                )}

                {!searchQuery && suggestions.length > 0 && (
                  <>
                    <SuggestionsTitle>Suggested People</SuggestionsTitle>
                    <p style={{ color: 'var(--galaxy-text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '0.95rem' }}>
                      Based on your movies and music taste
                    </p>
                    <UserList>
                      {suggestions.map((user, index) => (
                        <UserCard key={index}>
                          <UserAvatar>
                            {user.username.charAt(0).toUpperCase()}
                          </UserAvatar>
                          <UserDetails>
                            <UserName>{user.username}</UserName>
                            {user.bio && <UserBio>{user.bio}</UserBio>}
                            {user.similarity_reason && (
                              <UserBio style={{ fontStyle: 'italic', marginTop: '4px', color: 'rgba(102, 126, 234, 0.8)' }}>
                                {user.similarity_reason}
                              </UserBio>
                            )}
                          </UserDetails>
                          <FollowButton onClick={() => handleFollow(user.username)}>
                            Follow
                          </FollowButton>
                        </UserCard>
                      ))}
                    </UserList>
                  </>
                )}

                {!searchQuery && suggestions.length === 0 && (
                  <EmptyMessage>
                    Use the search bar above to find and add friends
                  </EmptyMessage>
                )}
              </SearchSection>
            </div>
          )}

          {activeTab === 'followers' && (
            <div>
              <SuggestionsTitle>Your Followers ({followers.length})</SuggestionsTitle>
              {followers.length > 0 ? (
                <UserList>
                  {followers.map((follower, index) => (
                    <UserCard key={index}>
                      <UserAvatar>
                        {follower.username.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserDetails>
                        <UserName>{follower.username}</UserName>
                        {follower.bio && <UserBio>{follower.bio}</UserBio>}
                      </UserDetails>
                      <FollowButton 
                        following={follower.is_following}
                        onClick={() => handleFollow(follower.username)}
                      >
                        {follower.is_following ? 'Following' : 'Follow Back'}
                      </FollowButton>
                    </UserCard>
                  ))}
                </UserList>
              ) : (
                <EmptyMessage>No followers yet</EmptyMessage>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div>
              <SuggestionsTitle>People You Follow ({following.length})</SuggestionsTitle>
              {following.length > 0 ? (
                <UserList>
                  {following.map((user, index) => (
                    <UserCard key={index}>
                      <UserAvatar>
                        {user.username.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserDetails>
                        <UserName>{user.username}</UserName>
                        {user.bio && <UserBio>{user.bio}</UserBio>}
                      </UserDetails>
                      <FollowButton 
                        following={true}
                        onClick={() => handleFollow(user.username)}
                      >
                        Following
                      </FollowButton>
                    </UserCard>
                  ))}
                </UserList>
              ) : (
                <EmptyMessage>Not following anyone yet</EmptyMessage>
              )}
            </div>
          )}

          {activeTab === 'account' && userInfo && (
            <div>
              <StatsRow>
                <StatBox onClick={() => setActiveTab('friends')}>
                  <StatValue>{userInfo.stats?.followers || 0}</StatValue>
                  <StatLabel>Followers</StatLabel>
                </StatBox>
                <StatBox onClick={() => setActiveTab('friends')}>
                  <StatValue>{userInfo.stats?.following || 0}</StatValue>
                  <StatLabel>Following</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{userInfo.stats?.watched || 0}</StatValue>
                  <StatLabel>Movies Watched</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{userInfo.stats?.reviews || 0}</StatValue>
                  <StatLabel>Reviews</StatLabel>
                </StatBox>
              </StatsRow>

              <InfoSection>
                <InfoLabel>Username</InfoLabel>
                <InfoValue>{userInfo.username}</InfoValue>
              </InfoSection>
              
              <InfoSection>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{userInfo.email}</InfoValue>
              </InfoSection>

              {userInfo.bio && (
                <InfoSection>
                  <InfoLabel>Bio</InfoLabel>
                  <InfoValue>{userInfo.bio}</InfoValue>
                </InfoSection>
              )}

              {userInfo.created_at && (
                <InfoSection>
                  <InfoLabel>Member Since</InfoLabel>
                  <InfoValue>{new Date(userInfo.created_at).toLocaleDateString()}</InfoValue>
                </InfoSection>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <SettingsSection>
                <SectionTitle>Integrations</SectionTitle>
                
                <SettingRow connected={spotifyConnected}>
                  <SettingInfo>
                    <SettingLabel>
                      Spotify Integration
                      <StatusBadge connected={spotifyConnected}>
                        {spotifyConnected ? 'Connected' : 'Not Connected'}
                      </StatusBadge>
                    </SettingLabel>
                    <SettingDescription>
                      {spotifyConnected 
                        ? `Connected as: ${spotifyDisplayName || 'Spotify User'}` 
                        : 'Connect your Spotify account to access your music library'}
                    </SettingDescription>
                  </SettingInfo>
                  {spotifyConnected && (
                    <Button danger onClick={() => setShowDisconnectModal(true)}>
                      Disconnect Spotify
                    </Button>
                  )}
                </SettingRow>
              </SettingsSection>
            </div>
          )}
        </TabContent>
      </ProfileCard>

      {showDisconnectModal && (
        <Modal onClick={() => !disconnecting && setShowDisconnectModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Disconnect Spotify?</ModalTitle>
            <ModalText>
              Are you sure you want to disconnect your Spotify account? 
              This will remove all Spotify integration and you'll need to reconnect 
              if you want to access your Spotify library again.
            </ModalText>
            <ModalButtons>
              <Button onClick={() => setShowDisconnectModal(false)} disabled={disconnecting}>
                Cancel
              </Button>
              <Button danger onClick={handleDisconnectSpotify} disabled={disconnecting}>
                {disconnecting ? 'Disconnecting...' : 'Yes, Disconnect'}
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
}

export default ProfilePage;

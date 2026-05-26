import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  perspective: 1200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  border-radius: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: translateZ(50px);
  animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateZ(50px) translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateZ(50px) translateY(0);
    }
  }
`;

const Title = styled.h1`
  color: #667eea;
  margin: 0;
  font-size: 2.5em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  transform: translateZ(20px);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateZ(30px) scale(1.1) rotateY(10deg);
  }
`;

const LogoutBtn = styled.button`
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transform: translateZ(15px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 25px rgba(211, 47, 47, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    transform: translateZ(25px) scale(1.05);
    box-shadow: 0 15px 40px rgba(211, 47, 47, 0.5);
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateZ(10px) scale(0.98);
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  perspective: 1200px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: translateZ(0px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateZ(30px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4);
    &::before {
      opacity: 1;
    }
  }
`;

const UploadSection = styled(Card)`
  grid-column: 1 / -1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(5px);

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2), 0 10px 25px rgba(102, 126, 234, 0.2);
    transform: translateZ(15px);
  }

  &:hover {
    border-color: #667eea;
    transform: translateZ(10px);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(5px);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2), 0 10px 25px rgba(102, 126, 234, 0.2);
    transform: translateZ(15px);
  }

  &:hover {
    border-color: #667eea;
    transform: translateZ(10px);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(5px);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2), 0 10px 25px rgba(102, 126, 234, 0.2);
    transform: translateZ(15px);
  }

  &:hover {
    border-color: #667eea;
    transform: translateZ(10px);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transform: translateZ(10px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover:not(:disabled) {
    transform: translateZ(20px) scale(1.05);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateZ(5px) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NotesList = styled(Card)`
  grid-column: 1 / -1;
`;

const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border: 2px solid #e8e8f0;
  border-radius: 10px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(0px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateZ(15px) translateX(5px);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-color: #667eea;
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
    &::before {
      left: 100%;
    }
  }
`;

const NoteInfo = styled.div`
  flex: 1;
  transform: translateZ(10px);
`;

const NoteName = styled.p`
  margin: 0 0 8px 0;
  font-weight: bold;
  color: #667eea;
  font-size: 16px;
`;

const NoteDesc = styled.p`
  margin: 0 0 8px 0;
  color: #666;
  font-size: 13px;
`;

const NoteBy = styled.p`
  margin: 0;
  color: #999;
  font-size: 11px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  transform: translateZ(15px);
`;

const ActionBtn = styled.button`
  background: linear-gradient(135deg, ${props => (props.delete ? '#d32f2f' : '#4caf50')} 0%, ${props => (props.delete ? '#b71c1c' : '#388e3c')} 100%);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transform: translateZ(8px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.5s, height 0.5s;
  }

  &:hover {
    transform: translateZ(15px) scale(1.08);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    &::after {
      width: 200px;
      height: 200px;
    }
  }

  &:active {
    transform: translateZ(3px) scale(0.96);
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    accessibleTo: 'all',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notes');
      setNotes(response.data.notes);
    } catch (error) {
      toast.error('Error fetching notes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Please select a file');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('file', formData.file);
    data.append('accessibleTo', formData.accessibleTo);

    try {
      setLoading(true);
      await axios.post('/api/notes/upload', data);
      toast.success('Note uploaded successfully');
      setFormData({ title: '', description: '', file: null, accessibleTo: 'all' });
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId, fileName) => {
    try {
      const response = await axios.get(`/api/notes/${noteId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await axios.delete(`/api/notes/${noteId}`);
      toast.success('Note deleted');
      fetchNotes();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>📚 Dashboard</Title>
        <UserInfo>
          {user?.avatar && <Avatar src={user.avatar} alt={user.name} />}
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              {user?.role?.toUpperCase()}
            </p>
          </div>
          <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        </UserInfo>
      </Header>

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <UploadSection>
          <h2>Upload Notes</h2>
          <Form onSubmit={handleUpload}>
            <Input
              type="text"
              name="title"
              placeholder="Note Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextArea
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleInputChange}
            />
            <Input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.zip"
              required
            />
            <Select
              name="accessibleTo"
              value={formData.accessibleTo}
              onChange={handleInputChange}
            >
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
            </Select>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Form>
        </UploadSection>
      )}

      <NotesList>
        <h2>Available Notes</h2>
        {notes.length === 0 ? (
          <p>No notes available</p>
        ) : (
          notes.map((note) => (
            <NoteItem key={note._id}>
              <NoteInfo>
                <NoteName>{note.title}</NoteName>
                {note.description && <NoteDesc>{note.description}</NoteDesc>}
                <NoteBy>
                  By {note.uploadedBy.name} • {note.views} views • {note.downloads} downloads
                </NoteBy>
              </NoteInfo>
              <Actions>
                <ActionBtn onClick={() => handleDownload(note._id, note.fileName)}>
                  ⬇️ Download
                </ActionBtn>
                {(user?.role === 'admin' || (user?.role === 'teacher' && user?.id === note.uploadedBy._id)) && (
                  <ActionBtn delete onClick={() => handleDelete(note._id)}>
                    🗑️ Delete
                  </ActionBtn>
                )}
              </Actions>
            </NoteItem>
          ))
        )}
      </NotesList>
    </DashboardContainer>
  );
};

export default Dashboard;

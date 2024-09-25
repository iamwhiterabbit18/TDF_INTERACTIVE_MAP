import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './styles/AudioManagement.scss';
import { useNavigate } from 'react-router-dom';
import AudioUpload from './AudioUpload';

const AudioManagement = () => {
  const [audios, setAudios] = useState([]);
  const [assignedTo, setAssignedTo] = useState(''); // 'onload' or 'onclick'
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is currently playing
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null); // Ref for controlling the audio element

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audio');
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };

  const handleAssign = async (audioId) => {
    if (!assignedTo) {
      alert('Please select a route to assign the audio.');
      return;
    }

    try {
      const payload = {
        audioId,
        route: assignedTo
      };
      const response = await axios.post('http://localhost:5000/api/audio/assign', payload);
      fetchAudios(); // Refresh the audios list after assigning
      alert(`Audio assigned to ${assignedTo}`);
    } catch (error) {
      console.error('Error assigning audio:', error);
    }
  };

  const handleOpenModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    fetchAudios(); // Refresh the audio list after upload
  };

  const handlePlayAudio = async (filePath, audioId) => {
    // Stop currently playing audio if different
    if (playingAudioId && playingAudioId !== audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioId(null);
    }

    // If same audio is clicked again, stop it
    if (playingAudioId === audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioId(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/${filePath}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPlayingAudioId(audioId);

      // Play the audio file
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleDelete = async (audioId) => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      try {
        await axios.delete(`http://localhost:5000/api/audio/delete/${audioId}`);
        fetchAudios(); // Refresh the audio list after deletion
        alert('Audio deleted successfully');
      } catch (error) {
        console.error('Error deleting audio:', error);
      }
    }
  };

  const handleUpdate = async (audioId) => {
    const newTitle = prompt('Enter new title for the audio:');
    if (newTitle) {
      try {
        await axios.put(`http://localhost:5000/api/audio/update/${audioId}`, { title: newTitle });
        fetchAudios(); // Refresh the audio list after updating
        alert('Audio updated successfully');
      } catch (error) {
        console.error('Error updating audio:', error);
      }
    }
  };

  return (
    <div className="audio-management-container">
      <div className="table-header">
        <h1>Audio Management</h1>
        <button className="upload-button" onClick={handleOpenModal}>
          Upload
        </button>
        <button className="navigate-button" onClick={() => navigate('/admin')}>
          Go to Admin Page
        </button>
      </div>

      <table className="audio-management-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>File Name</th>
            <th>Assigned To</th>
            <th>Assign</th>
            <th>Play</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {audios.map((audio) => (
            <tr key={audio._id}>
              <td>{audio.title}</td>
              <td>{audio.originalName}</td>
              <td>{audio.isAssignedToOnload ? 'Onload' : audio.isAssignedToOnclick ? 'Onclick' : 'Unassigned'}</td>
              <td>
                <select
                  value={audio.isAssignedToOnload ? 'onload' : audio.isAssignedToOnclick ? 'onclick' : 'unassigned'}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="unassigned">Unassigned</option>
                  <option value="onload">Onload</option>
                  <option value="onclick">Onclick</option>
                </select>
                <button onClick={() => handleAssign(audio._id)}>Assign</button>
              </td>
              <td>
                <button onClick={() => handlePlayAudio(audio.filePath, audio._id)}>Play</button>
              </td>
              <td>
                <button onClick={() => handleUpdate(audio._id)}>Update</button>
              </td>
              <td>
                <button onClick={() => handleDelete(audio._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for AudioUpload */}
      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <AudioUpload onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Audio player */}
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default AudioManagement;

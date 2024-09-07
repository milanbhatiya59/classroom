"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ClassPage() {
    const { classId } = useParams();
    const [classData, setClassData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [stream, setStream] = useState<boolean>(true);
    const [people, setPeople] = useState<boolean>(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loadAnnouncements, setLoadAnnouncements] = useState<boolean>(true);

    // Announcement state
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);

    useEffect(() => {
        fetchClassData();
        fetchUsersData();
        fetchClassAnnouncements();
    }, [classId, loadAnnouncements]);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/class?classId=${classId}`);
            const result = await res.json();
            if (res.ok) {
                setClassData(result.classData);
            } else {
                throw new Error(result.message || 'Failed to fetch class data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/getTeacherStudentDetails?classId=${classId}`);
            const result = await res.json();
            if (res.ok) {
                setTeachers(result.teachers);
                setStudents(result.students);
            } else {
                throw new Error(result.message || 'Failed to fetch user data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassAnnouncements = async () => {
        try {
            const res = await fetch(`/api/getAllAnnouncements?classId=${classId}`);
            const result = await res.json();
            if (res.ok) {
                setAnnouncements(result.announcements);
            } else {
                throw new Error(result.message || 'Failed to fetch announcements');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAnnouncementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newAnnouncement = {
            classId,
            title: announcementTitle,
            description: announcementMessage,
            comments: []
        };

        try {
            const response = await fetch(`/api/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnnouncement),
            });
            if (response.ok) {
                const result = await response.json();
                setAnnouncements((prev) => [result.announcementId, ...prev]);
                setAnnouncementTitle("");
                setAnnouncementMessage("");
                setShowCreateAnnouncement(false);
                setLoadAnnouncements((prev) => !prev);
            } else {
                console.error("Error posting announcement");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const toggleView = (view: 'stream' | 'people') => {
        setStream(view === 'stream');
        setPeople(view === 'people');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md p-6 rounded-lg text-slate-600 mb-6">
                <h2 className="text-3xl font-semibold">{classData?.subject}</h2>
                <p className="text-gray-900">{classData?.description}</p>
            </div>

            <nav className="mb-6 flex space-x-4">
                <button onClick={() => toggleView('stream')} className="text-gray-600 hover:underline text-lg">
                    Stream
                </button>
                <button onClick={() => toggleView('people')} className="text-gray-600 hover:underline text-lg">
                    People
                </button>
            </nav>

            {loading && <p className="text-gray-500">Loading data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {stream && classData && (
                <div className="space-y-8">
                    <button
                        onClick={() => setShowCreateAnnouncement((prev) => !prev)}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        {showCreateAnnouncement ? "Cancel Announcement" : "Make Announcement"}
                    </button>

                    {showCreateAnnouncement && (
                        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-3xl font-bold mb-6 text-gray-800">Make an Announcement</h3>
                            <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="announcementTitle" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="announcementTitle"
                                        value={announcementTitle}
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        placeholder="Enter the announcement title"
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="announcementMessage" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="announcementMessage"
                                        value={announcementMessage}
                                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                                        placeholder="Announce something to your class"
                                        rows={5}
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-gray-600 text-white px-6 py-2 rounded-md">
                                        Post Announcement
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Announcements</h3>
                        <div className="space-y-4">
                            {announcements.slice().reverse().map((announcement, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <h4 className="text-xl font-semibold mb-2">{announcement.title}</h4>
                                    <p>{announcement.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {people && (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Teachers</h3>
                        <ul className="space-y-4">
                            {teachers.map((teacher, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                                    <span>{teacher.username}</span>
                                    <button className="text-blue-500 hover:underline">{teacher.email}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Students</h3>
                        <ul className="space-y-4">
                            {students.map((student, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                                    <span>{student.username}</span>
                                    <button className="text-green-500 hover:underline">{student.email}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

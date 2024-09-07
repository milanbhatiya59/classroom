"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
  const [classes, setClasses] = useState([]);
  const { data } = useSession();

  const userId = data?.user?.id;

  const getClasses = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/getUserClasses/?userId=${userId}`, {
        method: "GET",
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        console.error("Failed to fetch classes:", result.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  };

  useEffect(() => {
    if (classes.length === 0 && userId) {
      const fetchClasses = async () => {
        const data = await getClasses(userId);
        setClasses(data);
      };
      fetchClasses();
    }
  }, [userId, classes.length]);

  return (
    <div className="mt-8 mx-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, index) => (
          <Link key={index} href={`class/${cls.id}`} passHref>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">{cls.subject}</h3>
              <p className="text-gray-600 mt-2 line-clamp-1 overflow-hidden">{cls.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

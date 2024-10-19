'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlane, FaMapMarkedAlt, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            여행의 시작, 여기서부터
          </h1>
          <p className="text-xl text-white opacity-80">
            당신의 꿈꾸던 여행을 계획하고 실현하세요
          </p>
        </motion.header>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <FaPlane className="text-4xl mb-4" />,
              title: "목적지 탐색",
              description: "전 세계의 아름다운 목적지를 발견하고 선택하세요."
            },
            {
              icon: <FaMapMarkedAlt className="text-4xl mb-4" />,
              title: "여행 계획 수립",
              description: "일정, 숙소, 교통편을 한 눈에 관리하세요."
            },
            {
              icon: <FaCalendarAlt className="text-4xl mb-4" />,
              title: "일정 관리",
              description: "체계적인 일정 관리로 완벽한 여행을 준비하세요."
            }
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              isHovered={hoveredCard === index}
              onHover={() => setHoveredCard(index)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/planner/create" data-cy="planner-page-button">
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg transition duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 8px rgb(255,255,255)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              여행 계획 시작하기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, isHovered, onHover, onLeave }: FeatureCardProps & { isHovered: boolean; onHover: () => void; onLeave: () => void }) {
  return (
    <motion.div
      className={`flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-lg p-6 text-white transition duration-300 ${isHovered ? 'bg-opacity-30' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div>
        {icon}
      </motion.div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="opacity-80">{description}</p>
    </motion.div>
  );
}
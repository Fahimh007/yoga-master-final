import React from "react";
import { FaUserFriends, FaChair } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const {
    _id,
    name,
    image,
    availableSeats,
    price,
    description,
    instructorName,
    totalEnrolled,
  } = item;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <span className="absolute top-4 right-4 bg-secondary text-white text-sm font-semibold px-3 py-1 rounded-full">
          ${price}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Top */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
            {name}
          </h3>
          <p className="text-primary text-sm font-medium mt-1">
            By {instructorName}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Bottom (locked) */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-primary" />
              <span>{totalEnrolled}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaChair className="text-primary" />
              <span>{availableSeats}</span>
            </div>
          </div>

          <Link to={`class/${_id}`} className="block">
            <button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors">
              Enroll Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;

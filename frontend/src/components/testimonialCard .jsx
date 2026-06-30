import React from 'react';
import { assets, dummyTestimonial } from '../assets/assets'; // adjust path as needed

const TestimonialCard = ({ testimonial }) => {
    const { name, role, image, rating = 0, feedback } = testimonial;

    const getStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const totalStars = 5;

        return [...Array(totalStars)].map((_, index) => {
            if (index < fullStars) {
                return <img key={index} src={assets.star} alt="star" className="w-5 h-5" />;
            } else if (index === fullStars && halfStar) {
                return <img key={index} src={assets.star} alt="half star" className="w-5 h-5 opacity-50" />;
            } else {
                return <img key={index} src={assets.star_blank} alt="blank star" className="w-5 h-5" />;
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-5 max-w-sm flex flex-col items-center text-center">
            <img src={image} alt={name} className="w-16 h-16 rounded-full mb-3" />
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">{role}</p>
            <div className="flex mb-3 justify-center">
                {getStars(rating)}
            </div>
            <p className="text-gray-700 text-sm">{feedback}</p>
        </div>
    );
};

const TestimonialSection = () => {
    return (
        <section className="py-10 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
            <div className="flex flex-wrap justify-center gap-6">
                {dummyTestimonial.map((item, index) => (
                    <TestimonialCard key={index} testimonial={item} />
                ))}
            </div>
        </section>
    );
};

export default TestimonialSection;

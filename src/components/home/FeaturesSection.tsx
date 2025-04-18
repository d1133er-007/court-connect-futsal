
import { motion } from "framer-motion"
import { Clock, Shield, Star } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Quick Booking",
    description: "Book your court in seconds with our easy-to-use platform. No hassle, no waiting."
  },
  {
    icon: Star,
    title: "Quality Courts",
    description: "All our courts are vetted for quality and maintained regularly. Play at the best venues."
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Safe and secure payment options. Book with confidence using our protected payment system."
  }
]

export const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="my-16 bg-gray-50 rounded-2xl p-8"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-900"
      >
        Why Players Choose Us
      </motion.h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white p-6 rounded-xl shadow-md text-center transform transition-all duration-300"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
              className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <feature.icon className="h-8 w-8 text-blue-600" />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-3 text-gray-900"
            >
              {feature.title}
            </motion.h3>
            <motion.p 
              className="text-gray-600"
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

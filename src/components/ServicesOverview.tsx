import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Boxes, Zap, Radio, Code2, Sparkles, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceItem } from '../types';

interface ServicesOverviewProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ onSelectService }) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-current" />;
      case 'Boxes':
        return <Boxes className="w-7 h-7 text-current" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-current" />;
      case 'Radio':
        return <Radio className="w-7 h-7 text-current" />;
      case 'Code2':
        return <Code2 className="w-7 h-7 text-current" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-7 h-7 text-current" />;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-32 bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Section Header */}
        <div>
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            ONE TEAM
          </span>
          <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight">
            FROM PHYSICAL PRODUCTS TO DIGITAL EXPERIENCES
          </h2>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              onClick={() => onSelectService(service)}
              className="group bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#1A3C2F] rounded-[20px] p-8 lg:p-10 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1.5 shadow-xs hover:shadow-xl cursor-pointer"
            >
              <div>
                {/* 56px Icon Square */}
                <div className="w-14 h-14 rounded-2xl bg-[#1A3C2F]/10 text-[#1A3C2F] group-hover:bg-[#1A3C2F] group-hover:text-[#FAF8F5] flex items-center justify-center mb-6 transition-colors duration-300">
                  {getServiceIcon(service.iconName)}
                </div>

                <h3 className="text-2xl font-bold text-[#1A3C2F] mb-3">
                  {service.title}
                </h3>

                <p className="text-xs text-[#5C6B60] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Service Items with Gold Dots */}
                <ul className="space-y-2.5 mb-8">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#5C6B60]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] mt-1 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F] group-hover:text-[#234B3C]">
                <span>{service.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

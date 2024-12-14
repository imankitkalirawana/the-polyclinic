import React from 'react';
import { IconType } from 'react-icons';
import { FiCreditCard, FiMail, FiUser, FiUsers } from 'react-icons/fi';
import { Link, Card as NextCard } from '@nextui-org/react';

const HoverDevCards = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card title="Account" subtitle="Manage profile" href="#" Icon={FiUser} />
      <Card title="Email" subtitle="Manage email" href="#" Icon={FiMail} />
      <Card title="Team" subtitle="Manage team" href="#" Icon={FiUsers} />
      <Card
        title="Billing"
        subtitle="Manage cards"
        href="#"
        Icon={FiCreditCard}
      />
    </div>
  );
};

interface CardType {
  title: string;
  subtitle: string;
  Icon: IconType;
  href: string;
}

const Card = ({ title, subtitle, Icon, href }: CardType) => {
  return (
    <NextCard
      as={Link}
      href={href}
      isHoverable
      className="group relative w-full overflow-hidden rounded-3xl p-4"
      isPressable
    >
      <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r transition-transform duration-300 group-hover:translate-y-[0%]" />

      <Icon className="absolute -right-12 -top-12 z-10 text-9xl text-default-100 transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary-400" />
      <Icon className="relative z-10 mb-2 text-2xl text-primary-600 transition-colors duration-300" />
      <h3 className="relative z-10 text-lg font-medium text-slate-950 duration-300">
        {title}
      </h3>
      <p className="relative z-10 text-default-500 duration-300">{subtitle}</p>
    </NextCard>
  );
};

export default HoverDevCards;

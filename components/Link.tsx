import Link, { LinkProps } from "next/link";
import React, { Children, ReactNode } from "react";

interface Props extends LinkProps {
  className?: string;
  children: ReactNode;
}

const CustomLink = (props: Props) => {
  const { href, className, children, ...rest } = props;

  return (
    <Link href={href} {...rest}>
      <a className={className} href={href.toString()}>
        {children}
      </a>
    </Link>
  );
};

export default CustomLink;

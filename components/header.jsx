import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../app/logo.png'

export default function HeaderBar() {
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <Image src={logo} width={30} height={30} alt="" />
          <span className="d-none d-lg-block">GetSente</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn"></i>
      </div>

      <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          {/* Add your navigation items here */}
        </ul>
      </nav>
    </header>
  );
};


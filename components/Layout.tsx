import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <header id="header" className="w-full z-10 top-0">
        <div className="w-full  mx-auto flex flex-wrap items-center justify-between  py-3">
          <div>
            <a
              className="text-gray-900 text-base no-underline hover:no-underline font-extrabold text-xl"
              href="#"
            >
              Gunghi 개발블로그
            </a>
          </div>

          <div className="block lg:hidden pr-4">
            <button className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-900 hover:border-green-500 appearance-none focus:outline-none">
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>

          <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 bg-gray-100 md:bg-transparent z-20">
            <ul className="list-reset lg:flex justify-end flex-1 items-center">
              {/* <li className="mr-3">
                <a
                  className="inline-block py-2 px-4 text-gray-900 font-bold no-underline"
                  href="#"
                >
                  Tags
                </a>
              </li> */}
              <li>
                <a
                  className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-2 px-4"
                  href="#"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;

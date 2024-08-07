import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePreviousPath = () => {
  const location = useLocation();
  const prevPath = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;
    return () => {
      prevPath.current = currentPath;
      localStorage.setItem('previousPath', location.pathname);
    };
  }, [location]);

  return prevPath.current;
};

// const usePreviousPath = () => {
//   const location = useLocation();
//   const prevLocation = useRef(location.pathname);
//   useEffect(() => {
//     const currentPathname = location.pathname;
//     const previousPathname = prevLocation.current;
    
//     if (currentPathname !== previousPathname) {
//       prevLocation.current = currentPathname;
//       localStorage.setItem('previousPath', previousPathname);
//     }
//   }, [location]);

//   return prevLocation.current;
// };

// export default usePreviousPath;

export default usePreviousPath;
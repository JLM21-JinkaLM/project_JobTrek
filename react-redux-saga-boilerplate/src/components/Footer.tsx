import { Box, Container } from '@gilbarbara/components';
import { text } from 'node:stream/consumers';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 container-fluid">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contacts</h5>
            <ul className="list-unstyled">
              <li>123 , elite tyower,Street 3, Pune</li>
              <li>Phone: 1234567890</li>
              <li>Email: demo@JobTrek.com</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Newsletter</h5>
            <form>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="newsletterEmail"
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center py-3">
        <p>&copy; 2024 Jobtrek. You are free to use. 😉</p>
      </div>
    </footer>
  );
}

// function Footer() {
//   return (
//     <Box as="footer" border={{ size: 1, side: 'top', color: 'gray.200' }}>
//       <Container py="lg">
//         <Box flexBox justify="space-between">
//           <iframe
//             frameBorder="0"
//             height="20px"
//             scrolling="0"
//             src="https://ghbtns.com/github-btn.html?user=gilbarbara&repo=react-redux-saga-boilerplate&type=star&count=true"
//             title="GitHub Stars"
//             width="110px"
//           />
//           <iframe
//             frameBorder="0"
//             height="20px"
//             scrolling="0"
//             src="https://ghbtns.com/github-btn.html?user=gilbarbara&type=follow&count=true"
//             title="GitHub Follow"
//             width="135px"
//           />
//         </Box>
//       </Container>
//     </Box>
//   );
// }

export default Footer;

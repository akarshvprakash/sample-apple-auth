// @ts-nocheck
'use client';
const encoder = new TextEncoder();

const user = {
  id: 1054,
  email: "rahul1rama@gmail.com",
  name: "Akarsh V"
}
const challengeBuffer = encoder.encode("34914012789326781858713765455437");
const openLogin = async () => {
  const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

  if(!isAvailable) {
    alert("feature not available");
    return;
  } else {
    if (confirm("Do you want to enable face id?")) {
    } else {
      return;
    }
  }

  let publicKeyCredential;
  const userIdBuffer = encoder.encode(user.id.toString());
  const options = {
      publicKey: {
          rp: { name: window.location.host, id: window.location.host },
          user: {
              name: user.email,
              id: userIdBuffer,
              displayName: user.name
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          challenge: challengeBuffer,
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            requiredResidentKey: false,
            userVerification: 'required'
          },
          attestation: "none"
      }
  };
  try {
      // Ensure this call is within an async function
      publicKeyCredential = await navigator.credentials.create(options);
      // Handle the created credential as needed
      localStorage.setItem("credentialId", publicKeyCredential.id);
      if(localStorage.getItem("credentialId")) alert("Credential Id Saved - "+localStorage.getItem("credentialId"));
  } catch (error) {
      console.error('Error creating credential:', error);
      // Handle errors appropriately
  }
}

const openAuth = async () => {
  const credentialId =  localStorage.getItem("credentialId");
  if(credentialId) {
    const credentialIdBuffer = encoder.encode(credentialId);
    const options = {
      publicKey: {
          challenge: challengeBuffer,
          allowCredentials: [{
              type: "public-key",
              id: credentialIdBuffer,
              transports: ["internal"]
          }],
        userVerification: 'required'
      }
    };
    alert("auth starting - "+credentialId);
    const publicKeyCredential = await navigator.credentials.get(options);
    alert("Authenticate !!!");
  } else {
    alert("apple faceid not enabled");
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <button onClick={openLogin}style={{width: "100%"}} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Register</button>
        <button onClick={openAuth} style={{width: "100%"}} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Authenticate</button>
      </div>
    </main>
  );
}

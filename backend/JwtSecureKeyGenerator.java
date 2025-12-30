import java.security.SecureRandom;
import java.util.Base64;

public class JwtSecureKeyGenerator {
    public static void main(String[] args) {
        // Generate 256 bits (32 bytes) of random data
        byte[] keyBytes = new byte[32];
        SecureRandom random = new SecureRandom();
        random.nextBytes(keyBytes);

        // Encode key to Base64 string
        String secureKey = Base64.getEncoder().encodeToString(keyBytes);
        
        // Print the generated key
        System.out.println("Generated Secure Key: " + secureKey);
    }
}
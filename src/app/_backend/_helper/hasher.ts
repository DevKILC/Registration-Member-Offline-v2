import * as crypto from 'crypto';

export class Hasher {
    /**
     * Hash a string using SHA-256
     */
    static sha256(data: string | number ): string {
        return crypto.createHash('sha256').update(data.toString()).digest('hex');
    }

    /**
     * Hash a string using MD5
     */
    static md5(data: string | number): string {
        return crypto.createHash('md5').update(data.toString()).digest('hex');
    }

    /**
     * Hash a string using SHA-1
     */
    static sha1(data: string | number ): string {
        return crypto.createHash('sha1').update(data.toString()).digest('hex');
    }

    /**
     * Hash a string using SHA-512
     */
    static sha512(data: string | number ): string {
        return crypto.createHash('sha512').update(data.toString()).digest('hex');
    }

    /**
     * Hash using any supported algorithm
     */
    static hash(data: string, algorithm: string = 'sha256', encoding: crypto.BinaryToTextEncoding = 'hex'): string {
        return crypto.createHash(algorithm).update(data).digest(encoding);
    }

    /**
     * Hash a password with salt using SHA-256
     */
    static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
        const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(password + generatedSalt).digest('hex');
        
        return {
            hash,
            salt: generatedSalt
        };
    }

    /**
     * Verify password against hash and salt
     */
    static verifyPassword(password: string, hash: string, salt: string): boolean {
        const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
        return hashedPassword === hash;
    }

    /**
     * Generate random salt
     */
    static generateSalt(length: number = 16): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Get list of available hash algorithms
     */
    static getAvailableAlgorithms(): string[] {
        return crypto.getHashes();
    }

    /**
     * Hash with HMAC
     */
    static hmac(data: string, key: string, algorithm: string = 'sha256'): string {
        return crypto.createHmac(algorithm, key).update(data.toString()).digest('hex');
    }
}
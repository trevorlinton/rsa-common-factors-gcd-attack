## RSA Common Factors Attack/Analysis

This is an implementation of the quasi linear greatest common demoninator (GCD) / public key and cert extractor written in node.js 

Papers and articles:

* [Breaking unbreakable code](https://algorithmsoup.wordpress.com/2019/01/15/breaking-an-unbreakable-code-part-1-the-hack/)
* [Understanding Common Factor Attacks](http://www.loyalty.org/~schoen/rsa/)

### Running

The main.js has an implementation of the RSA-crack via common factors in addition to a library routine that does much of the Useful Commands described below, it fetches the public certificate and extracts the key, modulus, exponent, size and other information that can then be put through a quasi factoring system using gcd.

```
./main.js www.example.com
```

### Useful commands

Print the public key from a pem file

```
openssl x509 -pubkey -noout -in cert.pem
```

Print the modulus from a pem file

```
openssl rsa -in sample.pem -pubin -modulus -noout
```


Get the certificate from a website via cli

```
openssl s_client -connect www.example.com:443 -servername www.example.com -showcerts
```
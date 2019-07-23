import java.util.Arrays;
import java.nio.charset.StandardCharsets;

class NotSoComplexHash {
  public static void main(String[] args) {
    String originalCard = "Subject: Boat;From: Charlie;To: Desmond;------Not Penny's boat";
    String modifiedCard = "Subject: Boat;From: Charlie;To: Desmond;------Penny's boat :)";
    String payloadedCard = "Subject: Boat;From: Charlie;To: Desmond;---03W000000S0e0000Xzzwue08BzQz0Z0DzzzzzzRzzzzzez_zz---Penny's boat :)";
    byte[] originalHash = notSoComplexHash(originalCard);
    byte[] modifiedHash = notSoComplexHash(modifiedCard);
    byte[] payloadedHash = notSoComplexHash(payloadedCard);
    printBytes(originalHash);
    printBytes(modifiedHash);
    printBytes(payloadedHash);

    System.out.println("Valid payload? " + equals(originalHash, payloadedHash));
  }

  public static byte[] notSoComplexHash(String inputText) {
    byte[] hash = new byte[16];
    Arrays.fill(hash, (byte) 0x00);
    byte[] textBytes = inputText.getBytes(StandardCharsets.ISO_8859_1);
    for (int i = 0; i < textBytes.length; i++) {
      hash[i % 16] = (byte) (hash[i % 16] + textBytes[i]);
    }
    return hash;
  }

  public static void printBytes(byte[] bytes) {
    System.out.print("[");
    for (int i = 0; i < bytes.length; i++) {
      System.out.print(bytes[i] + " ");
    }
    System.out.println("]");
  }

  public static boolean equals(byte[] a, byte[] b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}

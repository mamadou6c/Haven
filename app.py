#!/usr/bin/env python3
"""
Simple Python script that prints "hello" to the console.
"""

def main():
    """
    Main function that prints hello to the console.
    """
    try:
        print("hello")
    except Exception as e:
        print(f"Error occurred: {e}")
        return 1
    return 0

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)

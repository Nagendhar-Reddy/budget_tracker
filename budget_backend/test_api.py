import os
import sys
import django
from django.test.utils import get_runner
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'budget_backend.settings')
django.setup()

# Import Django's test runner
from django.test.runner import DiscoverRunner

# Run the tests
if __name__ == "__main__":
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(["authentication", "categories", "transactions", "budgets"])
    
    if failures:
        print(f"\n{failures} test(s) failed.")
        sys.exit(1)
    else:
        print("\nAll tests passed successfully!")